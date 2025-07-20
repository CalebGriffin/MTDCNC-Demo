import { Component, computed, input, Signal } from '@angular/core';
import { ChartConfiguration, ChartData, ChartOptions } from 'chart.js';
import { merge } from 'chart.js/helpers';
import { BaseChart } from "../base-chart/base-chart";

@Component({
  selector: 'app-line-chart',
  imports: [BaseChart],
  templateUrl: './line-chart.html',
  styleUrl: './line-chart.css'
})
export class LineChart {
  data = input.required<ChartData<'line'>>();
  options = input<ChartOptions<'line'>>();

  readonly defaultOptions: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          font: {
            size: 16,
          }
        }
      },
    },
    scales: {
      x: {
        ticks: {
          font: {
            size: 14
          }
        }
      },
      y: {
        ticks: {
          font: {
            size: 14
          },
        }
      }
    }
  };

  config: Signal<ChartConfiguration<'line'>> = computed(() => ({
    type: 'line',
    data: this.data(),
    options: this.options()
      ? merge({}, [this.defaultOptions, this.options()])
      : this.defaultOptions,
  }));
}
