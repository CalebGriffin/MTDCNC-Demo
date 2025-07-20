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

  createAverageUptimeData(machineData: MachineData[]): ChartData<'pie'> {
    const totalUptime = machineData.reduce((sum, machine) => {
      return sum + machine.dataPoints.filter(dp => dp.status === 1).length;
    }, 0);
    const totalDowntime = machineData.reduce((sum, machine) => {
      return sum + machine.dataPoints.filter(dp => dp.status === 0).length;
    }, 0);

    const total = totalUptime + totalDowntime;
    const uptimePercentage = Math.round(totalUptime / total * 100);
    const downtimePercentage = Math.round(totalDowntime / total * 100);

    return {
      labels: ['Average Uptime'],
      datasets: [{
        data: [uptimePercentage, downtimePercentage],
        backgroundColor: ['#4CAF50', '#F44336'],
        hoverBackgroundColor: ['#4CAF50', '#F44336'],
        borderWidth: 0,
      }]
    };
  }
}
