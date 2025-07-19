import { Component, inject } from '@angular/core';
import { StackedChart } from './charts/stacked-chart/stacked-chart';
import { DataGenerationService } from './services/data-generation-service';
import Machine1 from './static/machine-1.json';
import Machine2 from './static/machine-2.json';
import { DataPoint } from './types/data-point';
import { ChartData } from 'chart.js';
import { ProgressPieChart } from './charts/progress-pie-chart/progress-pie-chart';
import { GridElement } from './types/grid-element';
import { GridElementType } from './types/grid-element-type';

@Component({
  selector: 'app-root',
  imports: [StackedChart, ProgressPieChart],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  readonly dataGenService = inject(DataGenerationService);

  readonly GridElementType = GridElementType;

  uptimeData = this.dataGenService.createStackedChartData([
    { machineName: 'Machine 1', dataPoints: Machine1 as DataPoint[] },
    { machineName: 'Machine 2', dataPoints: Machine2 as DataPoint[] },
  ]);
  pieData: ChartData<'pie'> = {
    labels: ['Energy Consumption'],
    datasets: [{
      data: [70, 30],
      backgroundColor: ['#F5D536', '#C6C6C6'],
      hoverBackgroundColor: ['#F5D536', '#C6C6C6'],
      borderWidth: 0,
    }]
  };

  gridElements: GridElement[] = [
    {
      id: "1",
      type: GridElementType.UPTIME,
      chartData: this.uptimeData,
      x: 0,
      y: 0,
      width: 4,
      height: 4,
    },
    {
      id: "2",
      type: GridElementType.PROGRESS,
      chartData: this.pieData,
      x: 4,
      y: 0,
      width: 4,
      height: 4,
    },
    {
      id: "3",
      type: GridElementType.UPTIME,
      chartData: this.uptimeData,
      x: 4,
      y: 4,
      width: 4,
      height: 4,
    },
    {
      id: "4",
      type: GridElementType.PROGRESS,
      chartData: this.pieData,
      x: 0,
      y: 4,
      width: 4,
      height: 4,
    },
  ];
}
