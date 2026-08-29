import { Component, computed, signal } from "@angular/core";

import { PageHeaderComponent } from "../page-header/page-header.component";
import { SectionCardComponent } from "../section-card/section-card.component";
import { AnimatedNumberComponent } from "../animated-number/animated-number.component";
import { PeriodSelectorComponent } from "../period-selector/period-selector.component";
import { OverviewChartComponent } from "../charts/overview-chart/overview-chart.component";
import { DonutChartComponent } from "../charts/donut-chart/donut-chart.component";
import { SparklineComponent } from "../charts/sparkline/sparkline-chart.component";

import { FinanceStoreService } from "../../services/store.service";
import { formatCurrency, formatPercent } from "../../lib/format";
import { periodDays, type PeriodKey } from "../../lib/selectors";
import type { Investment } from "../../lib/finance-data";

const CLASS_COLORS: Record<string, string> = {
  Stocks: "var(--chart-1)",
  ETFs: "var(--chart-2)",
  Crypto: "var(--chart-5)",
  "Fixed income": "var(--chart-3)",
  Other: "var(--chart-6)",
};

type SortKey = "value" | "return";

interface Holding extends Investment {
  ret: number;
}

@Component({
  standalone: true,
  selector: "app-investments",
  imports: [
    PageHeaderComponent,
    SectionCardComponent,
    AnimatedNumberComponent,
    PeriodSelectorComponent,
    OverviewChartComponent,
    DonutChartComponent,
    SparklineComponent,
  ],
  templateUrl: "./investments.component.html",
})
export class InvestmentsComponent {
  readonly formatCurrency = formatCurrency;
  readonly formatPercent = formatPercent;
  readonly sortKeys: SortKey[] = ["value", "return"];

  period = signal<PeriodKey>("6m");
  sortKey = signal<SortKey>("value");

  constructor(readonly store: FinanceStoreService) {}

  totalValue = computed(() => this.store.investments.reduce((a, i) => a + i.value, 0));
  totalInvested = computed(() => this.store.investments.reduce((a, i) => a + i.invested, 0));
  gain = computed(() => this.totalValue() - this.totalInvested());
  gainPct = computed(() => (this.totalInvested() ? (this.gain() / this.totalInvested()) * 100 : 0));

  summaryCards = computed(() => [
    { label: "Total invested", value: this.totalInvested(), plain: false },
    { label: "Unrealized gain", value: this.gain(), plain: false },
    { label: "Holdings", value: this.store.investments.length, plain: true },
  ]);

  allocation = computed(() => {
    const map = new Map<string, number>();
    for (const i of this.store.investments) {
      map.set(i.assetClass, (map.get(i.assetClass) ?? 0) + i.value);
    }
    return [...map.entries()].map(([name, value]) => ({
      name,
      value: Math.round(value),
      color: CLASS_COLORS[name] ?? "var(--chart-6)",
    }));
  });

  points = computed(() => (periodDays(this.period()) <= 30 ? 8 : 12));

  series = computed(() => {
    const points = this.points();
    const steps = this.store.investments[0]?.spark.length ?? 7;

    return Array.from({ length: points }, (_, idx) => {
      const t = idx / (points - 1);
      const pos = t * (steps - 1);
      const lo = Math.floor(pos);
      const hi = Math.min(steps - 1, lo + 1);
      const frac = pos - lo;

      const value = this.store.investments.reduce(
        (a, inv) => a + ((inv.spark[lo] ?? 0) * (1 - frac) + (inv.spark[hi] ?? 0) * frac) * 1000,
        0,
      );

      return { label: `M${idx + 1}`, balance: Math.round(value) };
    });
  });

  holdings = computed<Holding[]>(() => {
    const rows: Holding[] = this.store.investments.map((i) => ({
      ...i,
      ret: i.invested ? ((i.value - i.invested) / i.invested) * 100 : 0,
    }));

    const key = this.sortKey();
    return rows.sort((a, b) => (key === "value" ? b.value - a.value : b.ret - a.ret));
  });

  bestPerformer = computed(() => this.holdings().reduce((a, b) => (a.ret > b.ret ? a : b)));

  largestPositionPct = computed(() => {
    const holdings = this.holdings();
    if (!holdings.length) return 0;
    return Math.round((holdings[0]!.value / this.totalValue()) * 100);
  });

  allocationPct(value: number): number {
    return Math.round((value / this.totalValue()) * 100);
  }

  isUp(ret: number): boolean {
    return ret >= 0;
  }

  setPeriod(period: PeriodKey): void {
    this.period.set(period);
  }

  setSortKey(key: SortKey): void {
    this.sortKey.set(key);
  }
}
