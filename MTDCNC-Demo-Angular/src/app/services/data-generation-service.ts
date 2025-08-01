import { inject, Injectable } from '@angular/core';
import { ChartData, ChartDataset, Color } from 'chart.js';
import { MachineData, NewMachineData } from '../types/machine-data';
import { DataPoint, NewDataPoint } from '../types/data-point';
import { GlobalsService } from './globals-service';

@Injectable({
  providedIn: 'root'
})
export class DataGenerationService {
  private readonly globalsService = inject(GlobalsService);

  createStackedChartData(
    machineData: (MachineData | NewMachineData)[],
    uptimeFilter: UptimeFilterFunction,
    downtimeFilter: UptimeFilterFunction
  ): ChartData<'bar'> {
    const labels = machineData.map(machine => machine.machineName);
    console.log(labels);
    
    const uptimePercentages = machineData.map(machine => {
      const totalDataPoints = machine.dataPoints.filter(dp =>
        uptimeFilter(dp) || downtimeFilter(dp)
      ).length;
      const uptimePoints = machine.dataPoints.filter(uptimeFilter).length;
      return totalDataPoints > 0 ? (uptimePoints / totalDataPoints) * 100 : 0;
    });
    console.log('Uptime percentages:', uptimePercentages);
    
    const downtimePercentages = machineData.map(machine => {
      const totalDataPoints = machine.dataPoints.filter(dp =>
        uptimeFilter(dp) || downtimeFilter(dp)
      ).length;
      const downtimePoints = machine.dataPoints.filter(downtimeFilter).length;
      return totalDataPoints > 0 ? (downtimePoints / totalDataPoints) * 100 : 0;
    });
    console.log('Downtime percentages:', downtimePercentages);

    return {
      labels: labels,
      datasets: [
        {
          label: 'Uptime (%)',
          data: uptimePercentages,
          backgroundColor: '#4CAF50',
        },
        {
          label: 'Downtime (%)',
          data: downtimePercentages,
          backgroundColor: '#F44336',
        }
      ]
    };
  }

  createAverageUptimeData(
    machineData: (MachineData | NewMachineData)[],
    uptimeFilter: UptimeFilterFunction,
    downtimeFilter: UptimeFilterFunction
  ): ChartData<'pie'> {
    const totalUptime = machineData.reduce((sum, machine) => {
      return sum + machine.dataPoints.filter(uptimeFilter).length;
    }, 0);
    const totalDowntime = machineData.reduce((sum, machine) => {
      return sum + machine.dataPoints.filter(downtimeFilter).length;
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

  createErrorData(
    machineData: NewMachineData[],
  ): ChartData<'pie' | 'polarArea'> {
    const data = machineData.map(this.getErrorCountsFromMachineData).reduce((merged, current) => {
      return merged.map((count, index) => count + current[index]);
    }, new Array(6).fill(0));
    return {
      labels: this.globalsService.ERROR_TYPE_LABELS.slice(1),
      datasets: [
        {
          data,
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0',
            '#9966FF',
            '#FF9F40',
          ],
          hoverOffset: 10,
        },
      ],
    };
  }

  createErrorRadarData(
    machineData: NewMachineData[],
  ): ChartData<'radar'> {
    const colours: Color[] = [
      'rgba(255, 99, 132, 1)',
      'rgba(54, 162, 235, 1)',
      'rgba(255, 206, 86, 1)',
      'rgba(75, 192, 192, 1)',
    ];

    const datasets: ChartDataset<'radar'>[] = machineData.map((machineData, index) => ({
      label: machineData.machineName,
      data: this.getErrorCountsFromMachineData(machineData),
      backgroundColor: colours[index].toString().replace(/, 1\)$/, ', 0.2)'),
      borderColor: colours[index],
      borderWidth: 1,
    }));

    return {
      labels: this.globalsService.ERROR_TYPE_LABELS.slice(1),
      datasets,
    };
  }

  private getErrorCountsFromMachineData(
    machineData: NewMachineData
  ): number[] {
    return machineData.dataPoints.reduce((errorCounts, dp) => {
      const errorValue = dp.errorCode;
      if (errorValue >= 1) {
        errorCounts[errorValue - 1]++;
      }
      return errorCounts;
    }, new Array(6).fill(0));
  }

  createConsumptionData(
    machineData: NewMachineData[],
  ): ChartData<'pie'> {
    const colours: Color[] = [
      '#F5D536',
      '#C6C6C6',
    ];
    const consumption = machineData.flatMap(machineData => machineData.dataPoints).reduce((currentConsumption, dp) => {
      if (dp.statusIndex === 1) {
        return currentConsumption + (this.globalsService.operatingPowerInKWH / 360);
      } else {
        return currentConsumption + (this.globalsService.idlePowerInKWH / 360);
      }
    }, 0);
    const total = this.globalsService.targetPowerConsumptionInKWH;
    const consumptionPercentage = Math.round(consumption / total * 100);
    const remainingPercentage = 100 - consumptionPercentage;
    return {
      labels: ['Energy Consumption'],
      datasets: [
        {
          data: [consumptionPercentage, remainingPercentage],
          backgroundColor: colours,
          hoverBackgroundColor: colours,
          borderWidth: 0,
        },
      ],
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

  createSimpleTimelineData(
    machineData: NewMachineData,
  ): ChartData<'bar'> {
    console.log(machineData);
    const colours: Color[] = [
      'grey',
      'green',
      'orange',
      'red',
    ];
    const datasets: ChartDataset<'bar'>[] = [];
    let currentStatus = machineData.dataPoints[0].status;
    let currentStatusIndex = machineData.dataPoints[0].statusIndex;
    let count = 1;

    for (let i = 1; i < machineData.dataPoints.length; i++) {
      const dp = machineData.dataPoints[i];
      // console.log(dp);

      if (dp.statusIndex !== currentStatusIndex) {
        console.log("Not the same", dp.statusIndex, currentStatusIndex);
        datasets.push({
          label: currentStatus,
          data: [count],
          backgroundColor: colours[currentStatusIndex],
          categoryPercentage: 1,
        });
        currentStatus = dp.status;
        currentStatusIndex = dp.statusIndex;
        count = 1;
      } else {
        count++;
      }
    }

    datasets.push({
      label: currentStatus,
      data: [count],
      backgroundColor: colours[currentStatusIndex],
      categoryPercentage: 1,
    });

    console.log(datasets);

    return {
      labels: ['Machine Status'],
      datasets,
    };
  }
}

export type UptimeFilterFunction = (dp: DataPoint | NewDataPoint) => boolean;
