import { Injectable } from '@angular/core';
import { MachineData } from '../types/machine-data';
import { ChartData } from 'chart.js';

@Injectable({
  providedIn: 'root'
})
export class DataGenerationService {
  createStackedChartData(machineData: MachineData[]): ChartData<'bar'> {
    const labels = machineData.map(machine => machine.machineName);
    const uptimeData = machineData.map(machine => 
      machine.dataPoints.filter(dp => dp.status === 1).length
    );
    const downtimeData = machineData.map(machine => 
      machine.dataPoints.filter(dp => dp.status === 0).length
    );

    return {
      labels: labels,
      datasets: [
        {
          label: 'Uptime',
          data: uptimeData,
          backgroundColor: '#4CAF50',
        },
        {
          label: 'Downtime',
          data: downtimeData,
          backgroundColor: '#F44336',
        }
      ]
    };
  }
}
