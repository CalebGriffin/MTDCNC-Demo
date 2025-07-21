import { Component, computed, input, Signal } from '@angular/core';
import { ChartConfiguration, ChartData, ChartOptions } from 'chart.js';
import { merge } from 'chart.js/helpers';
import { BaseChart } from "../base-chart/base-chart";

@Component({
  selector: 'app-bar-chart',
  imports: [BaseChart],
  templateUrl: './bar-chart.html',
  styleUrl: './bar-chart.css'
})
export class BarChart {
  data = input.required<ChartData<'bar'>>();
  options = input<ChartOptions<'bar'>>();
  readonly defaultOptions: ChartOptions<'bar'> = {};
  config: Signal<ChartConfiguration<'bar'>> = computed(() => ({
    type: 'bar',
    data: this.data(),
    options: this.options()
      ? merge({}, [this.options(), this.defaultOptions])
      : this.defaultOptions,
  }));
}
