import { computed, Injectable, signal } from "@angular/core";

import {
  budgets as seedBudgets,
  customers as seedCustomers,
  deals as seedDeals,
  goals as seedGoals,
  investments as seedInvestments,
  recurring as seedRecurring,
  supportMessages as seedMessages,
  tickets as seedTickets,
  transactions as seedTransactions,
  wallets as seedWallets,
  type Budget,
  type Deal,
  type DealStage,
  type Goal,
  type SupportMessage,
  type Transaction,
  type Wallet,
  type Workspace,
} from "../lib/finance-data";

const KEY = "luma.state.v1";

export type ThemeMode = "light" | "dark" | "system";

export interface Settings {
  name: string;
  email: string;
  language: string;
  currency: string;
  timezone: string;
  defaultWorkspace: Workspace;
  notifications: Record<string, boolean>;
  includePending: boolean;
  plan: "Free" | "Premium" | "Pro";
}

interface State {
  transactions: Transaction[];
  wallets: Wallet[];
  budgets: Budget[];
  goals: Goal[];
  deals: Deal[];
  messages: SupportMessage[];
  workspace: Workspace;
  theme: ThemeMode;
  settings: Settings;
}

const initialState: State = {
  transactions: seedTransactions,
  wallets: seedWallets,
  budgets: seedBudgets,
  goals: seedGoals,
  deals: seedDeals,
  messages: seedMessages,
  workspace: "personal",
  theme: "system",

  settings: {
    name: "Stella Diver",
    email: "stella@luma.finance",
    language: "English (US)",
    currency: "USD",
    timezone: "America/New_York",
    defaultWorkspace: "personal",

    notifications: {
      email: true,
      transactions: true,
      budgets: true,
      investments: false,
      weekly: true,
    },

    includePending: true,
    plan: "Premium",
  },
};

@Injectable({
  providedIn: "root",
})
export class FinanceStoreService {
  // -----------------------------
  // State
  // -----------------------------

  private readonly state = signal<State>(initialState);

  readonly ready = signal(false);

  // -----------------------------
  // Read-only state
  // -----------------------------

  readonly transactions = () => this.state().transactions;

  readonly wallets = () => this.state().wallets;

  readonly walletOptions = computed(() => {
    const workspace = this.workspace();

    return this.wallets().filter((wallet) => wallet.workspace === workspace);
  });

  readonly budgets = () => this.state().budgets;

  readonly goals = () => this.state().goals;

  readonly deals = () => this.state().deals;

  readonly messages = () => this.state().messages;

  readonly workspace = () => this.state().workspace;

  readonly theme = () => this.state().theme;

  readonly settings = () => this.state().settings;

  // Seed data that wasn't persisted in the React store

  readonly customers = seedCustomers;
  readonly investments = seedInvestments;
  readonly recurring = seedRecurring;
  readonly tickets = seedTickets;

  constructor() {
    this.load();

    this.applyTheme();

    this.setupThemeListener();
  }

  // -----------------------------
  // Persistence
  // -----------------------------

  private load(): void {
    try {
      const raw = localStorage.getItem(KEY);

      if (raw) {
        const parsed = JSON.parse(raw) as Partial<State>;

        this.state.update((current) => ({
          ...current,
          ...parsed,
          settings: {
            ...current.settings,
            ...parsed.settings,
          },
        }));
      }
    } catch {
      // Ignore invalid localStorage data
    }

    this.ready.set(true);

    this.persist();
  }

  private persist(): void {
    if (!this.ready()) {
      return;
    }

    try {
      localStorage.setItem(KEY, JSON.stringify(this.state()));
    } catch {
      // Ignore storage errors
    }
  }

  private updateState(updater: (state: State) => State): void {
    this.state.update(updater);
    this.persist();
  }

  // -----------------------------
  // Workspace
  // -----------------------------

  setWorkspace(workspace: Workspace): void {
    this.updateState((state) => ({
      ...state,
      workspace,
    }));
  }

  // -----------------------------
  // Theme
  // -----------------------------

  setTheme(theme: ThemeMode): void {
    this.updateState((state) => ({
      ...state,
      theme,
    }));

    this.applyTheme();
  }

  private applyTheme(): void {
    if (typeof document === "undefined") {
      return;
    }

    const theme = this.theme();

    const dark =
      theme === "dark" ||
      (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

    document.documentElement.classList.toggle("dark", dark);
  }

  private setupThemeListener(): void {
    if (typeof window === "undefined") {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    mediaQuery.addEventListener("change", () => {
      if (this.theme() === "system") {
        this.applyTheme();
      }
    });
  }

  // -----------------------------
  // Settings
  // -----------------------------

  updateSettings(patch: Partial<Settings>): void {
    this.updateState((state) => ({
      ...state,

      settings: {
        ...state.settings,
        ...patch,
      },
    }));
  }

  // -----------------------------
  // Transactions
  // -----------------------------

  addTransaction(transaction: Omit<Transaction, "id">): void {
    this.updateState((state) => ({
      ...state,

      transactions: [
        {
          ...transaction,
          id: this.uid(),
        },
        ...state.transactions,
      ].sort((a, b) => +new Date(b.date) - +new Date(a.date)),

      wallets: state.wallets.map((wallet) =>
        wallet.id === transaction.walletId
          ? {
              ...wallet,

              balance:
                wallet.balance +
                (transaction.type === "income" ? transaction.amount : -transaction.amount),
            }
          : wallet,
      ),
    }));
  }

  updateTransaction(id: string, patch: Partial<Transaction>): void {
    this.updateState((state) => ({
      ...state,

      transactions: state.transactions.map((transaction) =>
        transaction.id === id
          ? {
              ...transaction,
              ...patch,
            }
          : transaction,
      ),
    }));
  }

  deleteTransactions(ids: string[]): void {
    this.updateState((state) => ({
      ...state,

      transactions: state.transactions.filter((transaction) => !ids.includes(transaction.id)),
    }));
  }

  // -----------------------------
  // Wallets
  // -----------------------------

  addWallet(wallet: Omit<Wallet, "id">): void {
    this.updateState((state) => ({
      ...state,

      wallets: [
        ...state.wallets,
        {
          ...wallet,
          id: this.uid(),
        },
      ],
    }));
  }

  updateWallet(id: string, patch: Partial<Wallet>): void {
    this.updateState((state) => ({
      ...state,

      wallets: state.wallets.map((wallet) =>
        wallet.id === id
          ? {
              ...wallet,
              ...patch,
            }
          : wallet,
      ),
    }));
  }

  deleteWallet(id: string): void {
    this.updateState((state) => ({
      ...state,

      wallets: state.wallets.filter((wallet) => wallet.id !== id),
    }));
  }

  // -----------------------------
  // Budgets
  // -----------------------------

  addBudget(budget: Omit<Budget, "id">): void {
    this.updateState((state) => ({
      ...state,

      budgets: [
        ...state.budgets,
        {
          ...budget,
          id: this.uid(),
        },
      ],
    }));
  }

  updateBudget(id: string, patch: Partial<Budget>): void {
    this.updateState((state) => ({
      ...state,

      budgets: state.budgets.map((budget) =>
        budget.id === id
          ? {
              ...budget,
              ...patch,
            }
          : budget,
      ),
    }));
  }

  deleteBudget(id: string): void {
    this.updateState((state) => ({
      ...state,

      budgets: state.budgets.filter((budget) => budget.id !== id),
    }));
  }

  // -----------------------------
  // Goals
  // -----------------------------

  addGoal(goal: Omit<Goal, "id">): void {
    this.updateState((state) => ({
      ...state,

      goals: [
        ...state.goals,
        {
          ...goal,
          id: this.uid(),
        },
      ],
    }));
  }

  updateGoal(id: string, patch: Partial<Goal>): void {
    this.updateState((state) => ({
      ...state,

      goals: state.goals.map((goal) =>
        goal.id === id
          ? {
              ...goal,
              ...patch,
            }
          : goal,
      ),
    }));
  }

  deleteGoal(id: string): void {
    this.updateState((state) => ({
      ...state,

      goals: state.goals.filter((goal) => goal.id !== id),
    }));
  }

  // -----------------------------
  // Deals
  // -----------------------------

  addDeal(deal: Omit<Deal, "id">): void {
    this.updateState((state) => ({
      ...state,

      deals: [
        ...state.deals,
        {
          ...deal,
          id: this.uid(),
        },
      ],
    }));
  }

  updateDeal(id: string, patch: Partial<Deal>): void {
    this.updateState((state) => ({
      ...state,

      deals: state.deals.map((deal) =>
        deal.id === id
          ? {
              ...deal,
              ...patch,
            }
          : deal,
      ),
    }));
  }

  deleteDeal(id: string): void {
    this.updateState((state) => ({
      ...state,

      deals: state.deals.filter((deal) => deal.id !== id),
    }));
  }

  moveDeal(id: string, stage: DealStage): void {
    this.updateState((state) => ({
      ...state,

      deals: state.deals.map((deal) =>
        deal.id === id
          ? {
              ...deal,
              stage,
            }
          : deal,
      ),
    }));
  }

  // -----------------------------
  // Messages
  // -----------------------------

  sendMessage(text: string): void {
    this.updateState((state) => ({
      ...state,

      messages: [
        ...state.messages,

        {
          id: this.uid(),
          from: "user",
          text,
          at: new Date().toISOString(),
        },
      ],
    }));
  }

  // -----------------------------
  // Reset
  // -----------------------------

  resetDemo(): void {
    this.state.set(initialState);
    this.persist();

    this.applyTheme();
  }

  // -----------------------------
  // Utils
  // -----------------------------

  private uid(): string {
    return Math.random().toString(36).slice(2, 10);
  }
}
