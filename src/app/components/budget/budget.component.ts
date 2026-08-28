import { Component, ChangeDetectionStrategy, computed, inject, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import {
  LucidePiggyBank,
  LucidePlus,
  LucideTarget,
  LucideTrash2,
  LucideTrendingUp,
} from "@lucide/angular";

import { FinanceStoreService } from "../../services/store.service";
import { CATEGORIES, CATEGORY_COLORS } from "../../lib/finance-data";
import { formatCurrency, formatDate } from "../../lib/format";
import { inWorkspace, monthSpendByCategory } from "../../lib/selectors";

import { PageHeaderComponent } from "../page-header/page-header.component";
import { SectionCardComponent } from "../section-card/section-card.component";
import { EmptyStateComponent } from "../empty-state/empty-state.component";
import { BarsChartComponent } from "../charts/bars-chart/bars-chart.component";
import { AnimatedNumberComponent } from "../animated-number/animated-number.component";

import {
  createRdxDialogHandle,
  UbDialogCloseDirective,
  UbDialogDescriptionDirective,
  UbDialogFooterDirective,
  UbDialogHeaderDirective,
  UbDialogTitleDirective,
  UbDialogTriggerDirective,
} from "../../shared/components/ui/dialog";

export type StatusToneKey = "Healthy" | "Warning" | "Exceeded";

@Component({
  selector: "app-budget-page",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PageHeaderComponent,
    SectionCardComponent,
    EmptyStateComponent,
    BarsChartComponent,
    AnimatedNumberComponent,
    UbDialogHeaderDirective,
    UbDialogFooterDirective,
    UbDialogTitleDirective,
    UbDialogTriggerDirective,
    UbDialogCloseDirective,
    UbDialogDescriptionDirective,
  ],
  templateUrl: "./budget.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BudgetPageComponent {
  readonly store = inject(FinanceStoreService);

  readonly categories = CATEGORIES;
  readonly categoryColors = CATEGORY_COLORS;
  readonly formatCurrency = formatCurrency;
  readonly formatDate = formatDate;

  budgetModalHandle = createRdxDialogHandle();
  goalModalHandle = createRdxDialogHandle();

  readonly icons = { LucidePiggyBank, LucidePlus, LucideTarget, LucideTrash2, LucideTrendingUp };

  readonly statusTone: Record<StatusToneKey, string> = {
    Healthy: "bg-success/12 text-success",
    Warning: "bg-warning/15 text-warning",
    Exceeded: "bg-destructive/12 text-destructive",
  };

  readonly editingBudget = signal<string | null>(null);
  readonly bForm = signal({ category: "Food & Dining", limit: "" });
  readonly gForm = signal({ name: "", target: "", saved: "", emoji: "🎯" });

  readonly wsTx = computed(() => inWorkspace(this.store.transactions(), this.store.workspace()));
  readonly rows = computed(() => monthSpendByCategory(this.wsTx(), this.store.budgets()));
  readonly totalLimit = computed(() => this.rows().reduce((a, r) => a + r.limit, 0));
  readonly totalSpent = computed(() => this.rows().reduce((a, r) => a + r.spent, 0));
  readonly remaining = computed(() => this.totalLimit() - this.totalSpent());
  readonly totalSpentPercentage = computed(() =>
    this.totalLimit() ? Math.min(100, (this.totalSpent() / this.totalLimit()) * 100) : 0,
  );

  readonly summaryCards = computed(() => [
    { label: "Total budget", value: this.totalLimit() },
    { label: "Spent this month", value: this.totalSpent() },
    { label: "Remaining", value: this.remaining() },
  ]);

  readonly chartData = computed(() =>
    this.rows().map((r) => ({
      label: r.category.split(" ")[0],
      spent: Math.round(r.spent),
      limit: r.limit,
    })),
  );

  readonly chartKeys = [
    { key: "limit", color: "var(--chart-2)", label: "Limit" },
    { key: "spent", color: "var(--chart-1)", label: "Spent" },
  ];

  prepareNewBudget(): void {
    this.editingBudget.set(null);
    this.bForm.set({ category: "Food & Dining", limit: "" });
  }

  prepareEditBudget(r: { id: string; category: string; limit: number }): void {
    this.editingBudget.set(r.id);
    this.bForm.set({ category: r.category, limit: String(r.limit) });
  }

  prepareNewGoal(): void {
    this.gForm.set({ name: "", target: "", saved: "", emoji: "🎯" });
  }

  submitBudget(): void {
    const limit = Number(this.bForm().limit) || 0;
    if (!limit) return;

    const currentEditingId = this.editingBudget();
    if (currentEditingId) {
      this.store.updateBudget(currentEditingId, { limit });
    } else {
      this.store.addBudget({ category: this.bForm().category, limit, period: "monthly" });
    }
  }

  submitGoal(): void {
    const form = this.gForm();
    if (!form.name.trim()) return;

    this.store.addGoal({
      name: form.name.trim(),
      target: Number(form.target) || 0,
      saved: Number(form.saved) || 0,
      deadline: new Date(Date.now() + 180 * 86400000).toISOString(),
      emoji: form.emoji || "🎯",
    });
  }

  deleteBudget(id: string): void {
    this.store.deleteBudget(id);
  }

  deleteGoal(id: string): void {
    this.store.deleteGoal(id);
  }

  addQuickSavings(goal: { id: string; target: number; saved: number }, amt: number): void {
    this.store.updateGoal(goal.id, {
      saved: Math.min(goal.target, goal.saved + amt),
    });
  }

  updateBFormCategory(category: string): void {
    this.bForm.update((f) => ({ ...f, category }));
  }

  updateBFormLimit(limit: string): void {
    this.bForm.update((f) => ({ ...f, limit }));
  }

  updateGForm(field: keyof ReturnType<typeof this.gForm>, value: string): void {
    this.gForm.update((f) => ({ ...f, [field]: value }));
  }
}
