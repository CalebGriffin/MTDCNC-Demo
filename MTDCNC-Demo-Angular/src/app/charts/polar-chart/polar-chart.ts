import { Component, computed, input, Signal } from '@angular/core';
import { ChartConfiguration, ChartData, ChartOptions } from 'chart.js';
import { merge } from 'chart.js/helpers';
import { BaseChart } from "../base-chart/base-chart";

@Component({
  selector: 'app-polar-chart',
  imports: [BaseChart],
  templateUrl: './polar-chart.html',
  styleUrl: './polar-chart.css'
})
export class PolarChart {
  data = input.required<ChartData<'polarArea'>>();
  options = input<ChartOptions<'polarArea'>>();
  readonly defaultOptions: ChartOptions<'polarArea'> = {};
  config: Signal<ChartConfiguration<'polarArea'>> = computed(() => ({
    type: 'polarArea',
    data: this.data(),
    options: this.options()
      ? merge({}, [this.defaultOptions, this.options()])
      : this.defaultOptions,
  }));
}
