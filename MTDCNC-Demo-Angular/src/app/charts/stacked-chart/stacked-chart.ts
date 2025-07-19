import { Component, computed, input, Signal } from '@angular/core';
import { ChartConfiguration, ChartData, ChartOptions } from 'chart.js/auto';
import { BaseChart } from "../base-chart/base-chart";

@Component({
  selector: 'app-stacked-chart',
  imports: [BaseChart],
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
          callback: (value: string | number) => {
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
  config: Signal<ChartConfiguration<'bar'>> = computed(() => ({
    type: 'bar',
    data: this.data(),
    options: this.options,
  }));
}
