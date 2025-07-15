import { Component, inject } from '@angular/core';
import { StackedChart } from './charts/stacked-chart/stacked-chart';
import { DataGenerationService } from './services/data-generation-service';
import Machine1 from './static/machine-1.json';
import Machine2 from './static/machine-2.json';
import { DataPoint } from './types/data-point';

@Component({
  selector: 'app-root',
  imports: [StackedChart],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  readonly dataGenService = inject(DataGenerationService);
  uptimeData = this.dataGenService.createStackedChartData([
    { machineName: 'Machine 1', dataPoints: Machine1 as DataPoint[] },
    { machineName: 'Machine 2', dataPoints: Machine2 as DataPoint[] },
  ]);
}
