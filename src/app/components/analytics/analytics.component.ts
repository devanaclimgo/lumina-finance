import { Component, OnInit, computed, inject, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Meta, Title } from "@angular/platform-browser";
import {
  LucideArrowUpRight,
  LucideArrowDownRight,
  LucideActivity,
  LucideGauge,
  LucideLightbulb,
} from "@lucide/angular";

import { FinanceStoreService } from "../../services/store.service";
import { CATEGORY_COLORS } from "../../lib/finance-data";
import { formatCurrency, formatPercent } from "../../lib/format";
import { cn } from "@shared/utils/cn";
import {
  buildSeries,
  inWorkspace,
  incomeBySource,
  pctChange,
  periodDays,
  spendByCategory,
  totalBalance,
  totals,
  withinDays,
  PeriodKey,
} from "../../lib/selectors";

import { PageHeaderComponent } from "../page-header/page-header.component";
import { SectionCardComponent } from "../section-card/section-card.component";
import { PeriodSelectorComponent } from "../period-selector/period-selector.component";
import { AnimatedNumberComponent } from "../animated-number/animated-number.component";
import {
  OverviewChartComponent,
} from "../charts/overview-chart/overview-chart.component";
import { BarsChartComponent } from "../charts/bars-chart/bars-chart.component";
import { DonutChartComponent } from "../charts/donut-chart/donut-chart.component";
import { GaugeChartComponent } from "../charts/gauge-chart/gauge-chart.component";

@Component({
  selector: "app-analytics-page",
  standalone: true,
  imports: [
    CommonModule,
    PageHeaderComponent,
    SectionCardComponent,
    PeriodSelectorComponent,
    AnimatedNumberComponent,
    OverviewChartComponent,
    BarsChartComponent,
    DonutChartComponent,
    GaugeChartComponent,
  ],
  templateUrl: "./analytics.component.html",
})
export class AnalyticsPageComponent implements OnInit {
  private store = inject(FinanceStoreService);
  private titleService = inject(Title);
  private metaService = inject(Meta);

  period = signal<PeriodKey>("6m");

  days = computed(() => periodDays(this.period()));

  wsTx = computed(() => inWorkspace(this.store.transactions(), this.store.workspace()));

  current = computed(() => withinDays(this.wsTx(), this.days()));
  previous = computed(() => withinDays(this.wsTx(), this.days(), this.days()));

  cur = computed(() => totals(this.current()));
  prev = computed(() => totals(this.previous()));

  balance = computed(() => totalBalance(this.store.wallets(), this.store.workspace()));

  series = computed(() => buildSeries(this.current(), this.days(), this.balance()));

  categories = computed(() => spendByCategory(this.current()));
  sources = computed(() => incomeBySource(this.current()));

  totalSpend = computed(() => this.categories().reduce((a, c) => a + c.amount, 0));

  savingsRate = computed(() => {
    const income = this.cur().income;
    return income ? ((income - this.cur().expenses) / income) * 100 : 0;
  });

  prevSavings = computed(() => {
    const income = this.prev().income;
    return income ? ((income - this.prev().expenses) / income) * 100 : 0;
  });

  healthScore = computed(() => {
    const sr = this.savingsRate();
    const curVal = this.cur();
    const bal = this.balance();

    return Math.max(
      5,
      Math.min(
        100,
        Math.round(sr * 1.6 + (curVal.income > curVal.expenses ? 30 : 5) + (bal > 0 ? 20 : 0)),
      ),
    );
  });

  donut = computed(() =>
    this.categories()
      .slice(0, 6)
      .map((c) => ({
        name: c.category,
        value: Math.round(c.amount),
        color: CATEGORY_COLORS[c.category] ?? "var(--chart-6)",
      })),
  );

  compare = computed(() =>
    this.series().map((p) => ({
      label: p.label,
      income: p.income,
      expenses: p.expenses,
    })),
  );

  stats = computed(() => {
    const c = this.cur();
    const p = this.prev();
    const d = this.days();

    return [
      { label: "Income", value: c.income, change: pctChange(c.income, p.income) },
      {
        label: "Expenses",
        value: c.expenses,
        change: pctChange(c.expenses, p.expenses),
        invert: true,
      },
      { label: "Net cash flow", value: c.net, change: pctChange(c.net, p.net) },
      { label: "Avg. daily spend", value: c.expenses / d },
    ];
  });

  insights = computed(() => {
    const cats = this.categories();
    const total = this.totalSpend();
    const sr = this.savingsRate();
    const psr = this.prevSavings();
    const c = this.cur();
    const p = this.prev();

    const result: string[] = [];

    if (cats[0]) {
      const pct = Math.round((cats[0].amount / (total || 1)) * 100);
      result.push(
        `${cats[0].category} is your largest expense at ${formatCurrency(
          cats[0].amount,
        )} (${pct}% of spending).`,
      );
    }

    result.push(
      `Your savings rate is ${sr.toFixed(1)}%, ${
        sr >= psr ? "up from" : "down from"
      } ${psr.toFixed(1)}% in the previous period.`,
    );

    result.push(
      `Income changed ${formatPercent(
        pctChange(c.income, p.income),
      )} while expenses changed ${formatPercent(pctChange(c.expenses, p.expenses))}.`,
    );

    return result;
  });

  readonly ArrowUpRight = LucideArrowUpRight;
  readonly ArrowDownRight = LucideArrowDownRight;
  readonly Activity = LucideActivity;
  readonly Lightbulb = LucideLightbulb;
  readonly Gauge = LucideGauge;

  cn = cn;
  formatCurrency = formatCurrency;
  formatPercent = formatPercent;
  getCategoryColor = (cat: string) => CATEGORY_COLORS[cat] ?? "var(--chart-6)";

  ngOnInit() {
    this.titleService.setTitle("Spending Analytics — Luma");
    this.metaService.addTags([
      {
        name: "description",
        content:
          "Deep-dive into income and spending trends, category breakdowns and financial health.",
      },
      { property: "og:title", content: "Spending Analytics — Luma" },
      {
        property: "og:description",
        content: "Trends, breakdowns and a financial health score.",
      },
    ]);
  }

  isGoodTrend(s: { change?: number; invert?: boolean }): boolean {
    return s.invert ? (s.change ?? 0) <= 0 : (s.change ?? 0) >= 0;
  }
}
