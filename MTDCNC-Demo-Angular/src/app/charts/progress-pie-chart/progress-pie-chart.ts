import { Component, computed, input, Signal } from '@angular/core';
import { ChartConfiguration, ChartData, ChartOptions } from 'chart.js';
import { BaseChart } from "../base-chart/base-chart";

@Component({
  selector: 'app-progress-pie-chart',
  imports: [BaseChart],
  templateUrl: './progress-pie-chart.html',
  styleUrl: './progress-pie-chart.css'
})
export class ProgressPieChart {
  data = input.required<ChartData<'pie'>>();

  options: Signal<ChartOptions<'pie'>> = computed(() => ({
    circumference: 300,
    cutout: '85%',
    rotation: -150,
    animation: {
      animateRotate: false,
      animateScale: false,
    },
    spacing: 0,
    plugins: {
      tooltip: {
        enabled: false,
      },
      title: {
        display: true,
        text:  this.getChartTitle(this.data()),
        font: {
          // size: 56
          size: 28
        },
        position: 'bottom',
        padding: {
          // top: -30,
          top: -15
        },
      },
      legend: {
        // display: false,
        labels: {
          boxWidth: 0,
          font: {
            size: 16,
          }
        }
      }
    }
  }));

  config: Signal<ChartConfiguration<'pie'>> = computed(() => ({
    type: 'pie',
    data: this.data(),
    options: this.options(),
  }));

  getChartTitle(data: ChartData<'pie'>): string {
    return data.datasets[0].data.slice(0, -1).reduce((a, b) => a + b, 0) + '%';
  }
}
