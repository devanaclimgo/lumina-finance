import { CommonModule } from "@angular/common";
import { Component, ChangeDetectionStrategy, OnChanges, Input, SimpleChanges } from "@angular/core";
import { registerables, ChartData, ChartOptions } from "chart.js";
import { BaseChartDirective, provideCharts } from "ng2-charts";

@Component({
  selector: 'app-sparkline',

  standalone: true,

  imports: [CommonModule, BaseChartDirective],

  providers: [provideCharts({ registerables })],

  template: `
    <div class="w-full" [style.height.px]="height">
      <canvas baseChart [data]="chartData" [options]="chartOptions" [type]="'line'"></canvas>
    </div>
  `,

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SparklineComponent implements OnChanges {
  @Input() data: number[] = [];

  @Input() color = 'var(--chart-1)';

  @Input() height = 44;

  chartData: ChartData<'line'> = {
    labels: [],

    datasets: [],
  };

  chartOptions: ChartOptions<'line'> = {
    responsive: true,

    maintainAspectRatio: false,

    plugins: {
      legend: {
        display: false,
      },

      tooltip: {
        enabled: false,
      },
    },

    scales: {
      x: {
        display: false,
      },

      y: {
        display: false,
      },
    },

    elements: {
      line: {
        tension: 0.4,
      },

      point: {
        radius: 0,
      },
    },
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] || changes['color']) {
      this.buildChart();
    }
  }

  private buildChart(): void {
    this.chartData = {
      labels: this.data.map((_, index) => index),

      datasets: [
        {
          data: this.data,

          borderColor: this.color,

          borderWidth: 2,

          pointRadius: 0,

          tension: 0.4,

          fill: false,
        },
      ],
    };
  }
}
