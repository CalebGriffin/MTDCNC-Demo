import { Component, input } from '@angular/core';
import { ChartData, ChartOptions, Tick } from 'chart.js/auto';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-stacked-chart',
  imports: [BaseChartDirective],
  templateUrl: './stacked-chart.html',
  styleUrl: './stacked-chart.css'
})
export class StackedChart {
  data = input.required<ChartData<'bar'>>();
  readonly options: ChartOptions<'bar'> = {
    scales: {
      x: {
        stacked: true,
        ticks: {
          font: {
            size: 18
          }
        }
      },
      y: {
        stacked: true,
        ticks: {
          font: {
            size: 16
          },
          callback: (value: string | number, index: number, ticks: Tick[]) => {
            return value + '%';
          }
        }
      }
    },
    plugins: {
      title: {
        display: true,
        text: 'Machine Uptime (Prev Week)',
        font: {
          size: 36
        }
      },
      legend: {
        display: false,
      }
    },
  };
}
