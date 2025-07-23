import { Injectable } from '@angular/core';
import { ChartData, ChartDataset, Color } from 'chart.js';
import { MachineData } from '../types/machine-data';

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

  createDetailedTimelineData(
    statusTypes: { [label: string]: Color },
    sequence: { label: string, value: number }[]
  ): ChartDataset<'bar'>[] {
    const labels = Object.keys(statusTypes);

    return sequence.map(entry => {
      const colour = statusTypes[entry.label];
      if (!colour) throw new Error(`Unknown label: ${entry.label}`);

      const backgroundColour = labels.map(label =>
        label === entry.label ? colour : 'white'
      );

      return {
        label: entry.label,
        data: Array(labels.length).fill(entry.value),
        backgroundColor: backgroundColour,
        hoverBackgroundColor: [undefined],
        categoryPercentage: 1,
        barPercentage: 1,
      };
    });
  }
}
