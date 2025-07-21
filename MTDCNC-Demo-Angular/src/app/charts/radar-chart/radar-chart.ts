import { Component, computed, input, Signal } from '@angular/core';
import { ChartConfiguration, ChartData, ChartOptions } from 'chart.js';
import { BaseChart } from "../base-chart/base-chart";
import { merge } from 'chart.js/helpers';

@Component({
  selector: 'app-radar-chart',
  imports: [BaseChart],
  templateUrl: './radar-chart.html',
  styleUrl: './radar-chart.css'
})
export class RadarChart {
  data = input.required<ChartData<'radar'>>();
  options = input<ChartOptions<'radar'>>();
  readonly defaultOptions = {};

  config: Signal<ChartConfiguration<'radar'>> = computed(() => ({
    type: 'radar',
    data: this.data(),
    options: this.options()
      ? merge({}, [this.defaultOptions, this.options()])
      : this.defaultOptions,
  }));
}
