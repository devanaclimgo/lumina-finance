import { CommonModule, formatCurrency } from '@angular/common';
import { Component, ChangeDetectionStrategy, OnChanges, Input, SimpleChanges } from '@angular/core';
import { registerables, ChartData, ChartOptions } from 'chart.js';
import { BaseChartDirective, provideCharts } from 'ng2-charts';
import { formatCompact } from '../../../lib/format';

export interface BarChartKey {
  key: string;
  color: string;
  label: string;
}

const axisColor = 'var(--muted-foreground)';

const borderColor = 'var(--border)';

@Component({
  selector: 'app-bars-chart',

  standalone: true,

  imports: [CommonModule, BaseChartDirective],

  providers: [provideCharts({ registerables })],

  template: `
    <div class="w-full" [style.height.px]="height">
      <canvas baseChart [data]="chartData" [options]="chartOptions" [type]="'bar'"></canvas>
    </div>
  `,

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BarsChartComponent implements OnChanges {
  @Input() data: Array<Record<string, any>> = [];

  @Input() keys: BarChartKey[] = [];

  @Input() height = 280;

  @Input() stacked = false;

  chartData: ChartData<'bar'> = {
    labels: [],

    datasets: [],
  };

  chartOptions: ChartOptions<'bar'> = {
    responsive: true,

    maintainAspectRatio: false,

    plugins: {
      legend: {
        display: false,
      },

      tooltip: {
        callbacks: {
          label: (context) => {
            const value = Number(context.raw ?? 0);
            const locale = navigator.language || 'en-US';

            return ` ${context.dataset.label}: ${formatCurrency(value, locale, 'USD')}`;
          },
        },
      },
    },

    scales: {
      x: {
        stacked: false,

        grid: {
          display: false,
        },

        ticks: {
          color: axisColor,

          font: {
            size: 11,
          },
        },

        border: {
          display: false,
        },
      },

      y: {
        stacked: false,

        grid: {
          color: borderColor,
        },

        border: {
          display: false,
        },

        ticks: {
          color: axisColor,

          font: {
            size: 11,
          },

          callback: (value) => `$${formatCompact(Number(value))}`,
        },
      },
    },
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] || changes['keys'] || changes['stacked']) {
      this.buildChart();
    }
  }

  private buildChart(): void {
    this.chartData = {
      labels: this.data.map((row) => row['label']),

      datasets: this.keys.map((item) => ({
        label: item.label,

        data: this.data.map((row) => Number(row[item.key] ?? 0)),

        backgroundColor: item.color,

        borderRadius: 8,

        maxBarThickness: 38,

        stack: this.stacked ? 'a' : undefined,
      })),
    };

    this.chartOptions = {
      ...this.chartOptions,

      scales: {
        x: {
          ...(this.chartOptions.scales?.['x'] as any),

          stacked: this.stacked,
        },

        y: {
          ...(this.chartOptions.scales?.['y'] as any),

          stacked: this.stacked,
        },
      },
    };
  }
}
