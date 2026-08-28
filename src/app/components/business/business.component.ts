import { Component, computed, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { NgClass } from "@angular/common";

import { PageHeaderComponent } from "../page-header/page-header.component";
import { SectionCardComponent } from "../section-card/section-card.component";
import { AnimatedNumberComponent } from "../animated-number/animated-number.component";
import { BarsChartComponent } from "../charts/bars-chart/bars-chart.component";
import { OverviewChartComponent } from "../charts/overview-chart/overview-chart.component";

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
} from "../../shared/components/ui/dialog";

import { FinanceStoreService } from "../../services/store.service";
import { formatCurrency, formatDate, relativeDay } from "../../lib/format";
import { buildSeries, inWorkspace, totals, withinDays } from "../../lib/selectors";
import type { DealStage, Customer } from "../../lib/finance-data";

const STAGES: DealStage[] = ["Lead", "Qualified", "Proposal", "Negotiation", "Won", "Lost"];

const STAGE_TONE: Record<DealStage, string> = {
  Lead: "bg-muted text-muted-foreground",
  Qualified: "bg-chart-6/15 text-chart-6",
  Proposal: "bg-chart-2/15 text-chart-2",
  Negotiation: "bg-warning/15 text-warning",
  Won: "bg-success/12 text-success",
  Lost: "bg-destructive/12 text-destructive",
};

type TabKey = "pipeline" | "clients" | "revenue" | "invoices";

interface DealForm {
  customer: string;
  company: string;
  value: string;
  stage: DealStage;
}

@Component({
  standalone: true,
  selector: "app-business",
  imports: [
    FormsModule,
    NgClass,
    PageHeaderComponent,
    SectionCardComponent,
    AnimatedNumberComponent,
    BarsChartComponent,
    OverviewChartComponent,
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
  templateUrl: "./business.component.html",
})
export class BusinessComponent {
  readonly stages = STAGES;
  readonly stageTone = STAGE_TONE;
  readonly formatCurrency = formatCurrency;
  readonly formatDate = formatDate;
  readonly relativeDay = relativeDay;

  activeTab = signal<TabKey>("pipeline");
  dragging = signal<string | null>(null);
  over = signal<DealStage | null>(null);

  form = signal<DealForm>({ customer: "", company: "", value: "", stage: "Lead" });

  constructor(readonly store: FinanceStoreService) {}

  bizTx = computed(() => inWorkspace(this.store.transactions(), "business"));
  last90 = computed(() => withinDays(this.bizTx(), 90));
  totalsData = computed(() => totals(this.last90()));
  series = computed(() => buildSeries(this.last90(), 90, this.totalsData().net));

  pipelineValue = computed(() =>
    this.store
      .deals()
      .filter((d) => d.stage !== "Won" && d.stage !== "Lost")
      .reduce((a, d) => a + d.value, 0),
  );

  won = computed(() => this.store.deals().filter((d) => d.stage === "Won"));
  closedCount = computed(
    () => this.store.deals().filter((d) => d.stage === "Won" || d.stage === "Lost").length,
  );
  winRate = computed(() =>
    this.closedCount() ? (this.won().length / this.closedCount()) * 100 : 0,
  );

  topClients = computed(() =>
    [...this.store.customers].sort((a, b) => b.revenue - a.revenue).slice(0, 6),
  );

  stageChart = computed(() =>
    STAGES.map((s) => ({
      label: s,
      value: this.store
        .deals()
        .filter((d) => d.stage === s)
        .reduce((a, d) => a + d.value, 0),
    })),
  );

  chartKeys = [{ key: "value", color: "var(--chart-1)", label: "Value" }];

  summaryCards = computed(() => [
    { label: "Revenue (90d)", value: this.totalsData().income, formatter: formatCurrency },
    { label: "Expenses (90d)", value: this.totalsData().expenses, formatter: formatCurrency },
    { label: "Pipeline value", value: this.pipelineValue(), formatter: formatCurrency },
    { label: "Win rate", value: this.winRate(), formatter: (v: number) => `${v.toFixed(0)}%` },
  ]);

  initials(name: string) {
    return name
      .split(" ")
      .map((p) => p[0])
      .slice(0, 2)
      .join("");
  }

  setTab(tab: TabKey) {
    this.activeTab.set(tab);
  }

  readonly tabs: { key: TabKey; label: string }[] = [
    { key: "pipeline", label: "Pipeline" },
    { key: "clients", label: "Clients" },
    { key: "revenue", label: "Revenue" },
    { key: "invoices", label: "Invoices" },
  ];

  itemsForStage(stage: DealStage) {
    return this.store.deals().filter((d) => d.stage === stage);
  }

  stageValue(stage: DealStage) {
    return this.itemsForStage(stage).reduce((a, d) => a + d.value, 0);
  }

  onDragStart(id: string) {
    this.dragging.set(id);
  }

  onDragEnd() {
    this.dragging.set(null);
  }

  onDragOver(stage: DealStage, event: DragEvent) {
    event.preventDefault();
    this.over.set(stage);
  }

  onDragLeave(stage: DealStage) {
    if (this.over() === stage) this.over.set(null);
  }

  onDrop(stage: DealStage) {
    const id = this.dragging();
    if (id) this.store.moveDeal(id, stage);
    this.dragging.set(null);
    this.over.set(null);
  }

  deleteDeal(id: string) {
    this.store.deleteDeal(id);
  }

  prepareNewDeal() {
    this.form.set({ customer: "", company: "", value: "", stage: "Lead" });
  }

  updateForm(key: keyof DealForm, value: string) {
    this.form.update((f) => ({ ...f, [key]: value }));
  }

  submitDeal() {
    const f = this.form();
    if (!f.customer.trim()) return;

    this.store.addDeal({
      customer: f.customer.trim(),
      company: f.company.trim() || "—",
      value: Number(f.value) || 0,
      probability: 25,
      closeDate: new Date(Date.now() + 30 * 86400000).toISOString(),
      stage: f.stage,
      source: "Manual",
    });

    this.form.set({ customer: "", company: "", value: "", stage: "Lead" });
  }
}
