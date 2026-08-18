import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { CommonModule } from '@angular/common';
import { registerables, ChartData, ChartOptions } from 'chart.js';
import { BaseChartDirective, provideCharts } from 'ng2-charts';
import { formatCurrency } from '../../../lib/format';

@Component({
  selector: 'app-donut-chart',

  standalone: true,

  imports: [CommonModule, BaseChartDirective],

  providers: [provideCharts({ registerables })],

  template: `
    <div class="relative">
      <div [style.height.px]="height">
        <canvas baseChart [data]="chartData" [options]="chartOptions" [type]="'doughnut'"></canvas>
      </div>

      <div class="pointer-events-none absolute inset-0 grid place-items-center">
        <div class="text-center">
          <p class="text-[11px] text-muted-foreground">Total</p>

          <p class="text-xl font-bold num">
            {{ formattedTotal }}
          </p>
        </div>
      </div>
    </div>
  `,

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DonutChartComponent implements OnChanges {
  @Input() data: Array<{ name: string; value: number; color: string }> = [];

  @Input() height = 260;

  @Input() total?: number;

  chartData: ChartData<'doughnut'> = {
    labels: [],

    datasets: [],
  };

  chartOptions: ChartOptions<'doughnut'> = {
    responsive: true,

    maintainAspectRatio: false,

    cutout: '62%',

    plugins: {
      legend: {
        display: false,
      },

      tooltip: {
        callbacks: {
          label: (context) => {
            const value = Number(context.raw ?? 0);

            return ` ${context.label}: ${formatCurrency(value, 'USD', {
              compact: true,
            })}`;
          },
        },
      },
    },
  };

  get formattedTotal(): string {
    const sum = this.total ?? this.data.reduce((acc, item) => acc + item.value, 0);

    return formatCurrency(sum, 'USD', {
      compact: true,
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.buildChart();
    }
  }

  private buildChart(): void {
    this.chartData = {
      labels: this.data.map((item) => item.name),

      datasets: [
        {
          data: this.data.map((item) => item.value),

          backgroundColor: this.data.map((item) => item.color),

          borderWidth: 0,

          spacing: 3,

          borderRadius: 8,
        },
      ],
    };
  }
}
