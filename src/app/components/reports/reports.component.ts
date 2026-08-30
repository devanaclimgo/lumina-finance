import { Component, computed, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { NgClass } from "@angular/common";

import { PageHeaderComponent } from "../page-header/page-header.component";
import { SectionCardComponent } from "../section-card/section-card.component";
import { OverviewChartComponent } from "../charts/overview-chart/overview-chart.component";
import { BarsChartComponent } from "../charts/bars-chart/bars-chart.component";

import { FinanceStoreService } from "../../services/store.service";
import { ToastService } from "../../services/toast.service";
import { CATEGORY_COLORS } from "../../lib/finance-data";
import { formatCurrency, formatDate } from "../../lib/format";
import {
  buildSeries,
  inWorkspace,
  periodDays,
  spendByCategory,
  totalBalance,
  totals,
  withinDays,
  type PeriodKey,
} from "../../lib/selectors";

const SECTIONS = [
  { key: "summary", label: "Summary metrics" },
  { key: "trend", label: "Cash-flow trend" },
  { key: "categories", label: "Category table" },
  { key: "transactions", label: "Transaction list" },
] as const;

const REPORT_TYPES = ["Monthly summary", "Quarterly review", "Annual overview", "Custom range"];

const PERIOD_OPTIONS: { v: PeriodKey; l: string }[] = [
  { v: "7d", l: "Last 7 days" },
  { v: "30d", l: "Last 30 days" },
  { v: "3m", l: "Last 3 months" },
  { v: "6m", l: "Last 6 months" },
  { v: "1y", l: "Last 12 months" },
];

@Component({
  standalone: true,
  selector: "app-reports",
  imports: [
    FormsModule,
    PageHeaderComponent,
    SectionCardComponent,
    OverviewChartComponent,
    BarsChartComponent,
  ],
  templateUrl: "./reports.component.html",
})
export class ReportsComponent {
  readonly sections = SECTIONS;
  readonly reportTypes = REPORT_TYPES;
  readonly periodOptions = PERIOD_OPTIONS;
  readonly categoryColors = CATEGORY_COLORS;
  readonly formatCurrency = formatCurrency;
  readonly formatDate = formatDate;

  period = signal<PeriodKey>("30d");
  type = signal("Monthly summary");
  enabled = signal<string[]>(["summary", "trend", "categories"]);

  constructor(
    readonly store: FinanceStoreService,
    private readonly toast: ToastService,
  ) {}

  days = computed(() => periodDays(this.period()));
  wsTx = computed(() => inWorkspace(this.store.transactions(), this.store.workspace()));
  current = computed(() => withinDays(this.wsTx(), this.days()));
  cur = computed(() => totals(this.current()));
  balance = computed(() => totalBalance(this.store.wallets(), this.store.workspace()));
  series = computed(() => buildSeries(this.current(), this.days(), this.balance()));
  categories = computed(() => spendByCategory(this.current()));
  totalSpend = computed(() => this.categories().reduce((a, c) => a + c.amount, 0));

  barsSeries = computed(() => this.series().map((p) => ({ label: p.label, balance: p.balance })));
  barsKeys = [{ key: "balance", color: "var(--chart-2)", label: "Balance" }];

  summaryCards = computed(() => [
    { label: "Income", value: this.cur().income },
    { label: "Expenses", value: this.cur().expenses },
    { label: "Net", value: this.cur().net },
    { label: "Closing balance", value: this.balance() },
  ]);

  rangeLabel = computed(() => {
    const start = formatDate(new Date(Date.now() - this.days() * 86400000).toISOString(), "long");
    const end = formatDate(new Date().toISOString(), "long");
    return `${start} — ${end}`;
  });

  toggle(key: string): void {
    this.enabled.update((s) => (s.includes(key) ? s.filter((k) => k !== key) : [...s, key]));
  }

  has(key: string): boolean {
    return this.enabled().includes(key);
  }

  categoryShare(amount: number): number {
    return Math.round((amount / (this.totalSpend() || 1)) * 100);
  }

  txAmount(type: string, amount: number): number {
    return type === "income" ? amount : -amount;
  }

  setType(value: string): void {
    this.type.set(value);
  }

  setPeriod(value: PeriodKey): void {
    this.period.set(value);
  }

  print(): void {
    window.print();
  }

  shareReport(): void {
    this.toast.success("Share link copied to clipboard");
  }

  exportCsv(): void {
    const rows = [
      ["Date", "Description", "Category", "Type", "Amount"],
      ...this.current().map((t) => [
        t.date.slice(0, 10),
        t.description.replaceAll(",", " "),
        t.category,
        t.type,
        String(t.amount),
      ]),
    ];

    const csv = rows.map((r) => r.join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `luma-report-${this.period()}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    this.toast.success("Report exported as CSV");
  }
}
