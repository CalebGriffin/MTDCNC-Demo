import { Component, computed, input, Signal } from '@angular/core';
import { ChartConfiguration, ChartData, ChartOptions } from 'chart.js';
import { BaseChart } from "../base-chart/base-chart";
import { merge } from 'chart.js/helpers';

@Component({
  selector: 'app-pie-chart',
  imports: [BaseChart],
  templateUrl: './pie-chart.html',
  styleUrl: './pie-chart.css'
})
export class PieChart {
  data = input.required<ChartData<'pie'>>();
  options = input<ChartOptions<'pie'>>();

  readonly defaultOptions: ChartOptions<'pie'> = {
  };

  config: Signal<ChartConfiguration<'pie'>> = computed(() => ({
    type: 'pie',
    data: this.data(),
    options: this.options()
      ? merge({}, [this.defaultOptions, this.options()])
      : this.defaultOptions,
  }));
}
