import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  inject,
  signal,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { FinanceStoreService } from "../../services/store.service";
import { CATEGORIES, Transaction } from "../../lib/finance-data";

interface TransactionForm {
  description: string;
  amount: string;
  type: "income" | "expense";
  category: string;
  walletId: string;
  date: string;
  notes: string;
  recurring: boolean;
}

@Component({
  selector: "app-transaction-drawer",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./transaction-drawer.component.html",
})
export class TransactionDrawerComponent implements OnChanges {
  @Input() open = false;
  @Input() editing: Transaction | null = null;

  @Output() openChange = new EventEmitter<boolean>();

  private readonly store = inject(FinanceStoreService);

  readonly categories = CATEGORIES;

  readonly form = signal<TransactionForm>({
    description: "",
    amount: "",
    type: "expense",
    category: "Food & Dining",
    walletId: "w1",
    date: this.today(),
    notes: "",
    recurring: false,
  });

  readonly errors = signal<Record<string, string>>({});

  get wallets() {
    return this.store.wallets();
  }

  get workspace() {
    return this.store.workspace();
  }

  get walletOptions() {
    return this.store.walletOptions();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.open) {
      return;
    }

    if (changes["open"] || changes["editing"]) {
      this.initializeForm();
    }
  }

  private initializeForm(): void {
    this.errors.set({});

    if (this.editing) {
      this.form.set({
        description: this.editing.description,
        amount: String(this.editing.amount),
        type: this.editing.type,
        category: this.editing.category,
        walletId: this.editing.walletId,
        date: this.editing.date.slice(0, 10),
        notes: this.editing.notes ?? "",
        recurring: Boolean(this.editing.recurring),
      });

      return;
    }

    const firstWallet = this.walletOptions[0]?.id;

    this.form.update((current) => ({
      ...current,
      description: "",
      amount: "",
      notes: "",
      recurring: false,
      walletId: firstWallet ?? current.walletId,
      date: this.today(),
      type: "expense",
      category: "Food & Dining",
    }));
  }

  setType(type: "income" | "expense"): void {
    this.form.update((current) => ({
      ...current,
      type,
    }));
  }

  updateField<K extends keyof TransactionForm>(field: K, value: TransactionForm[K]): void {
    this.form.update((current) => ({
      ...current,
      [field]: value,
    }));
  }

  submit(): void {
    const current = this.form();

    const nextErrors: Record<string, string> = {};

    if (!current.description.trim()) {
      nextErrors["description"] = "Add a short description";
    }

    const amount = Number(current.amount);

    if (!current.amount || Number.isNaN(amount) || amount <= 0) {
      nextErrors["amount"] = "Enter an amount greater than 0";
    }

    this.errors.set(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    const payload = {
      description: current.description.trim(),
      merchant: current.description.trim(),
      amount: Math.round(amount * 100) / 100,
      type: current.type,
      category: current.category,
      walletId: current.walletId,
      date: new Date(`${current.date}T12:00:00`).toISOString(),
      status: "completed" as const,
      notes: current.notes,
      recurring: current.recurring,
      workspace: this.workspace,
    };

    if (this.editing) {
      this.store.updateTransaction(this.editing.id, payload);

      console.log("Transaction updated", payload.description);
    } else {
      this.store.addTransaction(payload);

      console.log(
        "Transaction added",
        `${payload.type === "income" ? "+" : "-"}$${payload.amount.toFixed(2)} · ${payload.category}`,
      );
    }

    this.close();
  }

  close(): void {
    this.openChange.emit(false);
  }

  private today(): string {
    return new Date().toISOString().slice(0, 10);
  }
}
