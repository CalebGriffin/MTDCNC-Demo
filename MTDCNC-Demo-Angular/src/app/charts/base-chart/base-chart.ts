import { AfterViewInit, Component, effect, ElementRef, input, OnDestroy, ViewChild } from '@angular/core';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-base-chart',
  imports: [],
  templateUrl: './base-chart.html',
  styleUrl: './base-chart.css'
})
export class BaseChart implements AfterViewInit, OnDestroy {
  config = input.required<ChartConfiguration>();

  @ViewChild('chartCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  private chart?: Chart;
  private resizeObserver?: ResizeObserver;

  constructor() {
    effect(() => {
      const chartConfig = this.config();
      if (!this.chart) return;
      this.updateChart(chartConfig);
    })
  }

  ngAfterViewInit(): void {
    this.createChart();
    this.setupResizeObserver();
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
      this.chart = undefined;
    }
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = undefined;
    }
  }

  private createChart() {
    const ctx = this.canvasRef.nativeElement.getContext('2d');
    if (!ctx) return;

    const config = {
      ...this.config(),
      options: {
        ...this.config().options,
        responsive: true,
        maintainAspectRatio: false,
      }
    };

    this.chart = new Chart(ctx, config);
  }

  private updateChart(newConfig: ChartConfiguration) {
    if (!this.chart) return;

    this.chart.data = newConfig.data;

    if (newConfig.options) {
      this.chart.options = {
        ...newConfig.options,
        responsive: true,
        maintainAspectRatio: false,
      }
    }

    this.chart.update();
  }

  private setupResizeObserver() {
    if (typeof ResizeObserver === 'undefined') return;

    this.resizeObserver = new ResizeObserver(() => {
      if (!this.chart) return;
      setTimeout(() => {
        this.chart?.resize();
      }, 0);
    });

    this.resizeObserver.observe(this.canvasRef.nativeElement.parentElement!);
  }
}
