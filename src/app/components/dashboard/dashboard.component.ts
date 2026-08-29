import { Component, OnInit, computed, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterLink } from "@angular/router";
import { DecimalPipe } from "@angular/common";

import { PageHeaderComponent } from "../page-header/page-header.component";
import { SectionCardComponent } from "../section-card/section-card.component";
import { EmptyStateComponent } from "../empty-state/empty-state.component";
import { StatCardComponent } from "../state-card/state-card.component";
import { PeriodSelectorComponent } from "../period-selector/period-selector.component";
import { TransactionItemComponent } from "../transaction-item/transaction-item.component";
import { TransactionDrawerComponent } from "../transaction-drawer/transaction-drawer.component";
import { OverviewChartComponent } from "../charts/overview-chart/overview-chart.component";
import { DonutChartComponent } from "../charts/donut-chart/donut-chart.component";
import { SparklineComponent } from "../charts/sparkline/sparkline-chart.component";

import { FinanceStoreService } from "../../services/store.service";
import { CATEGORY_COLORS } from "../../lib/finance-data";
import { formatCurrency, formatDate } from "../../lib/format";
import {
  buildSeries,
  inWorkspace,
  pctChange,
  periodDays,
  spendByCategory,
  totalBalance,
  totals,
  withinDays,
  type PeriodKey,
} from "../../lib/selectors";

@Component({
  standalone: true,
  selector: "app-dashboard",
  imports: [
    FormsModule,
    RouterLink,
    PageHeaderComponent,
    SectionCardComponent,
    EmptyStateComponent,
    StatCardComponent,
    PeriodSelectorComponent,
    TransactionItemComponent,
    TransactionDrawerComponent,
    OverviewChartComponent,
    DonutChartComponent,
    SparklineComponent,
    DecimalPipe,
  ],
  templateUrl: "./dashboard.component.html",
})
export class DashboardComponent implements OnInit {
  readonly formatCurrency = formatCurrency;
  readonly formatDate = formatDate;
  readonly categoryColors = CATEGORY_COLORS;
  readonly pctChange = pctChange;

  readonly legend = [
    { k: "Income", c: "var(--chart-3)" },
    { k: "Expenses", c: "var(--chart-4)" },
    { k: "Balance", c: "var(--chart-1)" },
  ];

  period = signal<PeriodKey>("30d");
  query = signal("");
  category = signal("all");
  drawer = signal(false);
  now = signal<Date | null>(null);

  constructor(readonly store: FinanceStoreService) {}

  ngOnInit(): void {
    this.now.set(new Date());
  }

  days = computed(() => periodDays(this.period()));

  wsTx = computed(() => inWorkspace(this.store.transactions(), this.store.workspace()));
  current = computed(() => withinDays(this.wsTx(), this.days()));
  previous = computed(() => withinDays(this.wsTx(), this.days(), this.days()));

  cur = computed(() => totals(this.current()));
  prev = computed(() => totals(this.previous()));

  balance = computed(() => totalBalance(this.store.wallets(), this.store.workspace()));
  series = computed(() => buildSeries(this.current(), this.days(), this.balance()));
  byCategory = computed(() => spendByCategory(this.current()).slice(0, 6));
  byCategoryTotal = computed(() => this.byCategory().reduce((a, x) => a + x.amount, 0));

  donutData = computed(() =>
    this.byCategory().map((c) => ({
      name: c.category,
      value: Math.round(c.amount),
      color: this.categoryColors[c.category] ?? "var(--chart-1)",
    })),
  );

  wsWallets = computed(() =>
    this.store.wallets().filter((w) => w.workspace === this.store.workspace()),
  );

  categories = computed(() => ["all", ...new Set(this.wsTx().map((t) => t.category))]);

  recent = computed(() =>
    this.wsTx()
      .filter(
        (t) =>
          (this.category() === "all" || t.category === this.category()) &&
          t.description.toLowerCase().includes(this.query().toLowerCase()),
      )
      .slice(0, 7),
  );

  greeting = computed(() => {
    const hour = this.now()?.getHours() ?? 9;
    return hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  });

  firstName = computed(() => this.store.settings().name.split(" ")[0]);

  todayLabel = computed(() => {
    const now = this.now();
    if (!now) return "";
    return now.toLocaleDateString("en-US", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  });

  subtitle = computed(() => {
    const label = this.todayLabel();
    const workspaceLabel =
      this.store.workspace() === "business" ? "Business workspace" : "Personal workspace";
    return `${label}${label ? " · " : ""}${workspaceLabel}`;
  });

  savingsRate = computed(() =>
    this.cur().income ? Math.round((this.cur().net / this.cur().income) * 100) : 0,
  );

  walletName(walletId: string): string {
    return this.store.wallets().find((w) => w.id === walletId)?.name ?? "";
  }

  setPeriod(period: PeriodKey): void {
    this.period.set(period);
  }

  updateQuery(value: string): void {
    this.query.set(value);
  }

  updateCategory(value: string): void {
    this.category.set(value);
  }

  openDrawer(): void {
    this.drawer.set(true);
  }

  setDrawerOpen(open: boolean): void {
    this.drawer.set(open);
  }
}
