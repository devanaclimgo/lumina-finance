import { Component, computed, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { NgClass } from "@angular/common";

import { createRdxAlertDialogHandle } from "../../shared/components/ui/alert-dialog";

import { FinanceStoreService } from "../../services/store.service";
import { ToastService } from "../../services/toast.service";
import { CATEGORY_COLORS } from "../../lib/finance-data";
import { formatCurrency, formatDate } from "../../lib/format";
import { inWorkspace, totals } from "../../lib/selectors";
import type { Transaction } from "../../lib/finance-data";
import { PageHeaderComponent } from "../page-header/page-header.component";
import { StatCardComponent } from "../state-card/state-card.component";
import { SectionCardComponent } from "../section-card/section-card.component";
import { EmptyStateComponent } from "../empty-state/empty-state.component";
import { TransactionDrawerComponent } from "../transaction-drawer/transaction-drawer.component";

type SortKey = "date-desc" | "date-asc" | "amount-desc" | "amount-asc";

@Component({
  standalone: true,
  selector: "app-transactions",
  imports: [
    NgClass,
    FormsModule,
    PageHeaderComponent,
    StatCardComponent,
    SectionCardComponent,
    EmptyStateComponent,
    TransactionDrawerComponent,
  ],
  host: {
    class: "flex flex-col gap-4",
  },
  templateUrl: "./transactions.component.html",
})
export class TransactionsComponent {
  readonly formatCurrency = formatCurrency;
  readonly formatDate = formatDate;
  readonly categoryColors = CATEGORY_COLORS;

  readonly confirmDialogHandle = createRdxAlertDialogHandle();

  query = signal("");
  category = signal("all");
  walletId = signal("all");
  type = signal("all");
  range = signal("90");
  sort = signal<SortKey>("date-desc");
  selected = signal<string[]>([]);
  drawer = signal(false);
  editing = signal<Transaction | null>(null);
  confirmIds = signal<string[] | null>(null);

  constructor(
    readonly store: FinanceStoreService,
    private readonly toast: ToastService,
  ) {}

  wsTx = computed(() => inWorkspace(this.store.transactions(), this.store.workspace()));

  categories = computed(() => ["all", ...new Set(this.wsTx().map((t) => t.category))]);

  wsWallets = computed(() =>
    this.store.wallets().filter((w) => w.workspace === this.store.workspace()),
  );

  filtered = computed(() => {
    const cutoff = Date.now() - Number(this.range()) * 86400000;
    const q = this.query().toLowerCase();

    const list = this.wsTx().filter(
      (t) =>
        (this.category() === "all" || t.category === this.category()) &&
        (this.walletId() === "all" || t.walletId === this.walletId()) &&
        (this.type() === "all" || t.type === this.type()) &&
        +new Date(t.date) >= cutoff &&
        (t.description.toLowerCase().includes(q) || t.category.toLowerCase().includes(q)),
    );

    const sorted = [...list];
    const key = this.sort();

    sorted.sort((a, b) => {
      if (key === "date-asc") return +new Date(a.date) - +new Date(b.date);
      if (key === "amount-desc") return b.amount - a.amount;
      if (key === "amount-asc") return a.amount - b.amount;
      return +new Date(b.date) - +new Date(a.date);
    });

    return sorted;
  });

  totalsData = computed(() => totals(this.filtered()));

  allSelected = computed(
    () => this.filtered().length > 0 && this.selected().length === this.filtered().length,
  );

  walletName(walletId: string): string {
    return this.store.wallets().find((w) => w.id === walletId)?.name ?? "—";
  }

  categoryColor(category: string): string {
    return this.categoryColors[category] ?? "var(--muted-foreground)";
  }

  isSelected(id: string): boolean {
    return this.selected().includes(id);
  }

  toggleSelected(id: string, checked: boolean): void {
    this.selected.update((s) => (checked ? [...s, id] : s.filter((x) => x !== id)));
  }

  toggleSelectAll(checked: boolean): void {
    this.selected.set(checked ? this.filtered().map((x) => x.id) : []);
  }

  clearSelection(): void {
    this.selected.set([]);
  }

  clearFilters(): void {
    this.query.set("");
    this.category.set("all");
    this.walletId.set("all");
    this.type.set("all");
    this.range.set("90");
    this.sort.set("date-desc");
  }

  updateQuery(value: string): void {
    this.query.set(value);
  }

  updateCategory(value: string): void {
    this.category.set(value);
  }

  updateWalletId(value: string): void {
    this.walletId.set(value);
  }

  updateType(value: string): void {
    this.type.set(value);
  }

  updateRange(value: string): void {
    this.range.set(value);
  }

  updateSort(value: SortKey): void {
    this.sort.set(value);
  }

  openNewTransaction(): void {
    this.editing.set(null);
    this.drawer.set(true);
  }

  openEditTransaction(tx: Transaction): void {
    this.editing.set(tx);
    this.drawer.set(true);
  }

  setDrawerOpen(open: boolean): void {
    this.drawer.set(open);
  }

  duplicateTransaction(tx: Transaction): void {
    const { id: _id, ...rest } = tx;
    this.store.addTransaction({ ...rest, date: new Date().toISOString() });
    this.toast.success("Transaction duplicated");
  }

  askDeleteSelected(): void {
    this.confirmIds.set(this.selected());
  }

  askDeleteOne(id: string): void {
    this.confirmIds.set([id]);
  }

  confirmDeleteLabel(): number {
    return this.confirmIds()?.length ?? 0;
  }

  confirmDelete(): void {
    const ids = this.confirmIds();
    if (!ids) return;

    this.store.deleteTransactions(ids);
    this.toast.success(`${ids.length} transaction(s) deleted`);
    this.selected.set([]);
    this.confirmIds.set(null);
  }
}
