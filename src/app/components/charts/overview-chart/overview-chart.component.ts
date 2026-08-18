import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { CommonModule, formatCurrency } from '@angular/common';

import { BaseChartDirective, provideCharts } from 'ng2-charts';

import { ChartData, ChartOptions, registerables } from 'chart.js';

import { Chart as ChartJS } from 'chart.js';

import { formatCompact } from '../../../lib/format';

ChartJS.register(...registerables);

const axisColor = 'var(--muted-foreground)';

const borderColor = 'var(--border)';

const defaultColors: Record<string, string> = {
  income: 'oklch(var(--chart-3))',
  expenses: 'oklch(var(--chart-4))',
  balance: 'oklch(var(--chart-1))',
  revenue: 'oklch(var(--chart-1))',
  profit: 'oklch(var(--chart-3))',
};

@Component({
  selector: 'app-chart-tooltip',
  standalone: true,
  template: '',
})
export class ChartTooltipComponent {}

@Component({
  selector: 'app-overview-chart',
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
export class OverviewChartComponent implements OnChanges {
  @Input() data: Array<Record<string, any>> = [];
  @Input() keys: string[] = ['income', 'expenses', 'balance'];
  @Input() height = 300;

  chartData: ChartData<'line'> = {
    labels: [],
    datasets: [],
  };

  chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,

    interaction: {
      mode: 'index',
      intersect: false,
    },

    plugins: {
      legend: {
        display: false,
      },

      tooltip: {
        callbacks: {
          label: (context) => {
            const value = Number(context.raw ?? 0);
            const locale = navigator.language || 'en-US';
            return `${context.dataset.label}: ${formatCurrency(value, locale, 'USD')}`;
          },
        },
      },
    },

    scales: {
      x: {
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
    if (changes['data'] || changes['keys']) {
      this.buildChart();
    }
  }

  private buildChart(): void {
    const labels = this.data.map((row) => row['label']);

    this.chartData = {
      labels,

      datasets: this.keys.map((key) => {
        const color = defaultColors[key] ?? 'var(--chart-1)';

        return {
          label: key,
          data: this.data.map((row) => Number(row[key] ?? 0)),
          borderColor: color,
          backgroundColor: this.createGradient(color),
          borderWidth: 2.4,
          pointRadius: 0,
          pointHoverRadius: 5,
          tension: 0.4,
          fill: true,
        };
      }),
    };
  }
  private createGradient(color: string): string {
    return `color-mix(in srgb, ${color} 35%, transparent)`;
  }
}
