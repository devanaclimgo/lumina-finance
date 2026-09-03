import { Component, computed, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { NgClass } from "@angular/common";

import { PageHeaderComponent } from "../page-header/page-header.component";
import { SectionCardComponent } from "../section-card/section-card.component";
import { EmptyStateComponent } from "../empty-state/empty-state.component";
import { AnimatedNumberComponent } from "../animated-number/animated-number.component";
import { SparklineComponent } from "../charts/sparkline/sparkline-chart.component";
import { TransactionItemComponent } from "../transaction-item/transaction-item.component";

import {
  UbDialogRootDirective,
  UbDialogTriggerDirective,
  UbDialogPortalDirective,
  UbDialogBackdropDirective,
  UbDialogPopupComponent,
  UbDialogHeaderDirective,
  UbDialogFooterDirective,
  UbDialogTitleDirective,
  UbDialogCloseDirective,
  createRdxDialogHandle,
} from "../../shared/components/ui/dialog";

import { FinanceStoreService } from "../../services/store.service";
import { formatCurrency, relativeDay } from "../../lib/format";
import type { Wallet } from "../../lib/finance-data";

type WalletType = Wallet["type"];

interface WalletForm {
  name: string;
  type: WalletType;
  balance: string;
  currency: string;
  institution: string;
  last4: string;
}

const EMPTY_FORM: WalletForm = {
  name: "",
  type: "bank",
  balance: "",
  currency: "USD",
  institution: "",
  last4: "",
};

const TYPE_ICON: Record<WalletType, string> = {
  bank: "LucideLandmark",
  credit: "LucideCreditCard",
  cash: "LucideWallet",
  investment: "LucideLineChart",
};

@Component({
  standalone: true,
  selector: "app-wallets",
  imports: [
    FormsModule,
    NgClass,
    PageHeaderComponent,
    SectionCardComponent,
    EmptyStateComponent,
    AnimatedNumberComponent,
    SparklineComponent,
    TransactionItemComponent,
    UbDialogRootDirective,
    UbDialogTriggerDirective,
    UbDialogPortalDirective,
    UbDialogBackdropDirective,
    UbDialogPopupComponent,
    UbDialogHeaderDirective,
    UbDialogFooterDirective,
    UbDialogTitleDirective,
    UbDialogCloseDirective,
  ],
  templateUrl: "./wallets.component.html",
})
export class WalletsComponent {
  readonly formatCurrency = formatCurrency;
  readonly relativeDay = relativeDay;
  readonly typeIcon = TYPE_ICON;
  readonly walletTypes: WalletType[] = ["bank", "credit", "cash", "investment"];
  readonly currencies = ["USD", "EUR", "GBP", "BRL"];

  readonly walletModalHandle = createRdxDialogHandle();

  selected = signal<string | null>(null);
  open = signal(false);
  editing = signal<Wallet | null>(null);
  form = signal<WalletForm>({ ...EMPTY_FORM });

  constructor(readonly store: FinanceStoreService) {}

  list = computed(() => this.store.wallets().filter((w) => w.workspace === this.store.workspace()));

  activeId = computed(() => {
    const sel = this.selected();
    const list = this.list();
    return sel && list.some((w) => w.id === sel) ? sel : list[0]?.id;
  });

  active = computed(() => this.list().find((w) => w.id === this.activeId()));

  total = computed(() => this.list().reduce((a, w) => a + w.balance, 0));
  assets = computed(() =>
    this.list()
      .filter((w) => w.balance > 0)
      .reduce((a, w) => a + w.balance, 0),
  );
  debt = computed(() =>
    this.list()
      .filter((w) => w.balance < 0)
      .reduce((a, w) => a + w.balance, 0),
  );

  summaryCards = computed(() => [
    { label: "Net worth", value: this.total() },
    { label: "Total assets", value: this.assets() },
    { label: "Total debt", value: this.debt() },
  ]);

  walletTx = computed(() =>
    this.store
      .transactions()
      .filter((t) => t.walletId === this.activeId())
      .slice(0, 8),
  );

  selectWallet(id: string): void {
    this.selected.set(id);
  }

  isCredit(w: Wallet): boolean {
    return w.type === "credit";
  }

  isActive(id: string): boolean {
    return this.activeId() === id;
  }

  openNew(): void {
    this.editing.set(null);
    this.form.set({ ...EMPTY_FORM });
    this.open.set(true);
  }

  openEdit(w: Wallet): void {
    this.editing.set(w);
    this.form.set({
      name: w.name,
      type: w.type,
      balance: String(w.balance),
      currency: w.currency,
      institution: w.institution,
      last4: w.last4 ?? "",
    });
    this.open.set(true);
  }

  updateForm(key: keyof WalletForm, value: string): void {
    this.form.update((f) => ({ ...f, [key]: value }));
  }

  submit(): void {
    const f = this.form();
    if (!f.name.trim()) return;

    const editing = this.editing();

    const payload = {
      name: f.name.trim(),
      type: f.type,
      balance: Number(f.balance) || 0,
      currency: f.currency,
      institution: f.institution.trim() || "Manual",
      last4: f.last4.trim(),
      updatedAt: new Date().toISOString(),
      trend: editing?.trend ?? [0, 0, 0, 0, 0, 0, (Number(f.balance) || 0) / 1000],
      workspace: this.store.workspace(),
    };

    if (editing) {
      this.store.updateWallet(editing.id, payload);
    } else {
      this.store.addWallet(payload);
    }

    this.open.set(false);
  }

  deleteActive(): void {
    const active = this.active();
    if (!active) return;

    this.store.deleteWallet(active.id);
    this.selected.set(null);
  }
}
