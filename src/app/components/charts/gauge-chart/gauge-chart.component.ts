import { CommonModule } from "@angular/common";
import { Component, ChangeDetectionStrategy, OnChanges, Input, SimpleChanges } from "@angular/core";
import { registerables, ChartData, ChartOptions } from "chart.js";
import { BaseChartDirective, provideCharts } from "ng2-charts";

@Component({
  selector: "app-gauge-chart",

  standalone: true,

  imports: [CommonModule, BaseChartDirective],

  providers: [provideCharts({ registerables })],

  template: `
    <div class="relative">
      <div [style.height.px]="height">
        <canvas baseChart [data]="chartData" [options]="chartOptions" [type]="'doughnut'"></canvas>
      </div>

      <div class="pointer-events-none absolute inset-0 grid place-items-center pt-4">
        <div class="text-center">
          <p class="text-4xl font-extrabold num text-gradient">
            {{ Math.round(value) }}
          </p>

          <p class="text-xs text-muted-foreground">out of 100</p>
        </div>
      </div>
    </div>
  `,

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GaugeChartComponent implements OnChanges {
  @Input() value = 0;

  @Input() height = 200;

  readonly Math = Math;

  chartData: ChartData<"doughnut"> = {
    labels: ["Score", "Remaining"],

    datasets: [
      {
        data: [0, 100],

        backgroundColor: ["oklch(var(--chart-1))", "oklch(var(--muted))"],

        borderWidth: 0,

        circumference: 240,

        rotation: -120,

        borderRadius: 12,
      },
    ],
  };

  chartOptions: ChartOptions<"doughnut"> = {
    responsive: true,

    maintainAspectRatio: false,

    cutout: "72%",

    plugins: {
      legend: {
        display: false,
      },

      tooltip: {
        enabled: false,
      },
    },
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["value"]) {
      const normalizedValue = Math.max(
        0,

        Math.min(100, this.value),
      );

      this.chartData = {
        ...this.chartData,

        datasets: [
          {
            ...this.chartData.datasets[0],

            data: [normalizedValue, 100 - normalizedValue],
          },
        ],
      };
    }
  }
}
