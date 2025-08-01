import { Component, computed, effect, inject, OnInit, Signal, signal, WritableSignal } from '@angular/core';
import { ChartData, ChartOptions, ChartTypeRegistry, Color, LegendItem } from 'chart.js';
import { merge } from 'chart.js/helpers';
import { BarChart } from './charts/bar-chart/bar-chart';
import { LineChart } from './charts/line-chart/line-chart';
import { PieChart } from './charts/pie-chart/pie-chart';
import { PolarChart } from './charts/polar-chart/polar-chart';
import { ProgressPieChart } from './charts/progress-pie-chart/progress-pie-chart';
import { RadarChart } from './charts/radar-chart/radar-chart';
import { StackedChart } from './charts/stacked-chart/stacked-chart';
import { DataGenerationService } from './services/data-generation-service';
import Machine1 from './static/machine-1.json';
import Machine2 from './static/machine-2.json';
import Machine3 from './static/machine-3.json';
import Machine4 from './static/machine-4.json';
import { DataPoint, NewDataPoint } from './types/data-point';
import { GridElement } from './types/grid-element';
import { GridElementType } from './types/grid-element-type';
import { DataFetchingService } from './services/data-fetching-service';
import humanizeDuration from 'humanize-duration';
import { NgComponentOutlet } from '@angular/common';
import { DataSelection } from './components/data-selection/data-selection';
import { DataFilterService } from './services/data-filter-service';

@Component({
  selector: 'app-root',
  imports: [
    StackedChart,
    ProgressPieChart,
    PieChart,
    LineChart,
    RadarChart,
    PolarChart,
    BarChart,
    NgComponentOutlet,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  ngOnInit(): void {
    // console.log(this.machineData);
    // console.log(this.newMachineData);
  }

  constructor() {
    effect(() => {
      console.log(this.newMachineData());
    });
  }

  readonly dataGenService = inject(DataGenerationService);
  readonly dataFetchService = inject(DataFetchingService);
  readonly dataFilterService = inject(DataFilterService);

  readonly GridElementType = GridElementType;

  machineData = [
    { machineName: 'Machine 1', dataPoints: Machine1 as DataPoint[] },
    { machineName: 'Machine 2', dataPoints: Machine2 as DataPoint[] },
    { machineName: 'Machine 3', dataPoints: Machine3 as DataPoint[] },
    { machineName: 'Machine 4', dataPoints: Machine4 as DataPoint[] },
  ];

  // newMachineData = this.dataFetchService.getAllMachineData();
  newMachineData = this.dataFilterService.machineData;

  uptimeData: Signal<ChartData<'bar'>> = computed(() =>
    this.dataGenService.createStackedChartData(
      this.newMachineData(),
      dp => (dp as NewDataPoint).statusIndex === 1,
      dp => (dp as NewDataPoint).statusIndex === 3,
    )
  );
  averageUptimeData: Signal<ChartData<'pie'>> = computed(() =>
    this.dataGenService.createAverageUptimeData(
      this.newMachineData(),
      dp => (dp as NewDataPoint).statusIndex === 1,
      dp => (dp as NewDataPoint).statusIndex === 3,
    )
  );
  // consumptionData: ChartData<'pie'> = {
  //   labels: ['Energy Consumption'],
  //   datasets: [
  //     {
  //       data: [70, 30],
  //       backgroundColor: ['#F5D536', '#C6C6C6'],
  //       hoverBackgroundColor: ['#F5D536', '#C6C6C6'],
  //       borderWidth: 0,
  //     },
  //   ],
  // };
  consumptionData: Signal<ChartData<'pie'>> = computed(() =>
    this.dataGenService.createConsumptionData(
      this.newMachineData()
    )
  );
  // errorData: ChartData<'pie' | 'polarArea'> = {
  //   labels: [
  //     'Machine Fault',
  //     'Material Shortage',
  //     'Operator Error',
  //     'Maintenance',
  //     'Material Fault',
  //     'Power Issue',
  //   ],
  //   datasets: [
  //     {
  //       data: [4, 3, 2, 1, 5, 2],
  //       backgroundColor: [
  //         '#FF6384',
  //         '#36A2EB',
  //         '#FFCE56',
  //         '#4BC0C0',
  //         '#9966FF',
  //         '#FF9F40',
  //       ],
  //       hoverOffset: 10,
  //     },
  //   ],
  // };

  errorData: Signal<ChartData<'pie' | 'polarArea'>> = computed(() =>
    this.dataGenService.createErrorData(
      this.newMachineData()
    )
  );

  errorChartOptions: ChartOptions<'pie' | 'polarArea'> = {
    plugins: {
      title: {
        display: true,
        text: 'Downtime Causes',
        font: {
          size: 32,
        },
      },
      legend: {
        position: 'bottom',
        labels: {
          font: {
            size: 16,
          },
        },
      },
    },
  };
  prevWeekErrors: ChartData<'line' | 'bar'> = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        type: 'bar',
        label: 'Errors',
        data: [5, 3, 4, 2, 6, 1, 3],
        backgroundColor: '#F44336',
      },
      {
        type: 'line',
        label: 'Energy Consumption',
        data: [6, 4, 9, 5, 7, 6, 8],
        fill: false,
        borderColor: '#F5D536',
        backgroundColor: '#F5D536',
        tension: 0.2,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  // errorRadarData: ChartData<'radar'> = {
  //   labels: [
  //     'Machine Fault',
  //     'Material Shortage',
  //     'Operator Error',
  //     'Maintenance',
  //     'Material Fault',
  //     'Power Issue',
  //   ],
  //   datasets: [
  //     {
  //       label: 'Machine 1',
  //       data: [4, 3, 2, 1, 5, 2],
  //       backgroundColor: 'rgba(255, 99, 132, 0.2)',
  //       borderColor: 'rgba(255, 99, 132, 1)',
  //       borderWidth: 1,
  //     },
  //     {
  //       label: 'Machine 2',
  //       data: [3, 2, 4, 1, 6, 3],
  //       backgroundColor: 'rgba(54, 162, 235, 0.2)',
  //       borderColor: 'rgba(54, 162, 235, 1)',
  //       borderWidth: 1,
  //     },
  //     {
  //       label: 'Machine 3',
  //       data: [2, 4, 1, 3, 1, 3],
  //       backgroundColor: 'rgba(255, 206, 86, 0.2)',
  //       borderColor: 'rgba(255, 206, 86, 1)',
  //       borderWidth: 1,
  //     },
  //     {
  //       label: 'Machine 4',
  //       data: [1, 3, 2, 4, 3, 2],
  //       backgroundColor: 'rgba(75, 192, 192, 0.2)',
  //       borderColor: 'rgba(75, 192, 192, 1)',
  //       borderWidth: 1,
  //     },
  //   ],
  // };
  errorRadarData: Signal<ChartData<'radar'>> = computed(() =>
    this.dataGenService.createErrorRadarData(
      this.newMachineData()
    )
  );
  errorRadarOptions: ChartOptions<'radar'> = {
    scales: {
      r: {
        min: 0,
        ticks: {
          stepSize: 1,
        },
      },
    },
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: {
            size: 16,
          },
        },
      },
      title: {
        display: true,
        text: 'Error Types by Machine',
        font: {
          size: 32,
        },
      },
    },
  };

  errorChartIndex: WritableSignal<number> = signal(0);
  timelineChartIndex: WritableSignal<number> = signal(0);

  // timelineChartData: ChartData<'bar'> = {
  //   // labels: ['Error', 'Warning', 'In Operation', 'Idle'],
  //   labels: ['Machine Status'],
  //   datasets: [
  //     {
  //       label: 'Idle',
  //       data: [55],
  //       backgroundColor: 'grey',
  //       categoryPercentage: 1,
  //     },
  //     {
  //       label: 'In Operation',
  //       data: [25],
  //       backgroundColor: 'green',
  //       categoryPercentage: 1,
  //     },
  //     {
  //       label: 'Warning',
  //       data: [5],
  //       backgroundColor: 'orange',
  //       categoryPercentage: 1,
  //     },
  //     {
  //       label: 'In Operation',
  //       data: [25],
  //       backgroundColor: 'green',
  //       categoryPercentage: 1,
  //       minBarLength: 0,
  //     },
  //     {
  //       label: 'Error',
  //       data: [15],
  //       backgroundColor: 'red',
  //       categoryPercentage: 1,
  //     },
  //     {
  //       label: 'Idle',
  //       data: [35],
  //       backgroundColor: 'grey',
  //       categoryPercentage: 1,
  //       minBarLength: 0,
  //     },
  //   ],
  // };

  timelineChartData: Signal<ChartData<'bar'>> = computed(() =>
    this.dataGenService.createSimpleTimelineData(
      this.newMachineData()[0]
    )
  );

  timelineChartOptions: Signal<ChartOptions<'bar'>> = computed(() => {
    return {
      indexAxis: 'y',
      plugins: {
        legend: {
          // display: false,
          labels: {
            filter: (item: LegendItem, data: ChartData<'bar'>) => {
              const labels = data.datasets.map(ds => ds.label);
              return labels.indexOf(labels[item.datasetIndex!]) === item.datasetIndex;
            }
          },
          onClick: function() {},
        },
        tooltip: {
          callbacks: {
            label: function(tooltipItem) {
              const value = tooltipItem.parsed.x
              const seconds = value * 10;
              const milliseconds = seconds * 1000;

              return humanizeDuration(milliseconds);
            }
          }
        },
        title: {
          display: true,
          position: "bottom",
          text: this.newMachineData()[0].machineName,
          font: {
            size: 22
          }
        }
      },
      responsive: true,
      scales: {
        x: {
          max: this.timelineChartData().datasets.flatMap(d => (d.data as unknown as number)).reduce((a, b) => a + b, 0),
          stacked: true,
          grid: {
            display: false,
          },
          ticks: {
            display: false,
          },
          border: {
            display: false,
          },
        },
        y: {
          stacked: true,
          grid: {
            display: false,
          },
          ticks: {
            display: false,
          },
          border: {
            display: false,
          },
        },
      }
    }
  });

  detailedTimelineStatusTypes: {[label: string]: Color} = {
    'Error': 'red',
    'Warning': 'orange',
    'In Operation': 'green',
    'Idle': 'grey',
  };

  detailedTimelineSequence: { label: string, value: number }[] = [
    { label: 'Idle', value: 55 },
    { label: 'In Operation', value: 25 },
    { label: 'Warning', value: 5 },
    { label: 'In Operation', value: 25 },
    { label: 'Error', value: 15 },
    { label: 'Idle', value: 35 },
  ];

  detailedTimelineChartData: ChartData<'bar'> = {
    labels: ['Error', 'Warning', 'In Operation', 'Idle'],
    datasets: this.dataGenService.createDetailedTimelineData(
      this.detailedTimelineStatusTypes,
      this.detailedTimelineSequence
    ),
  };

  detailedTimelineChartOptions: ChartOptions<'bar'> = {
    plugins: {
      tooltip: {
        filter: function(tooltipItem, _index, _tooltipItems, data) {
          const dataset = data.datasets[tooltipItem.datasetIndex];
          const bgColor = dataset?.backgroundColor;
          if (Array.isArray(bgColor)) {
            return bgColor[tooltipItem.dataIndex] !== 'white';
          }
          return false;
        }
      },
      legend: {
        display: false,
      }
    },
    scales: {
      y: {
        ticks: {
          display: true,
          font: {
            size: 16
          }
        }
      }
    }
  };

  gridElements: Signal<GridElement[]> = computed(() => [
    {
      id: '1',
      type: GridElementType.UPTIME,
      chartData: this.uptimeData() as ChartData<'bar'>,
      x: 0,
      y: 0,
      width: 4,
      height: 4,
    },
    {
      id: '2',
      type: GridElementType.PROGRESS,
      chartData: this.consumptionData(),
      x: 4,
      y: 0,
      width: 2,
      height: 2,
    },
    {
      id: '5',
      type: GridElementType.PROGRESS,
      chartData: this.averageUptimeData(),
      x: 6,
      y: 0,
      width: 2,
      height: 2,
    },
    {
      id: '3',
      type: GridElementType.LINE,
      chartData: this.prevWeekErrors,
      x: 4,
      y: 4,
      width: 4,
      height: 4,
    },
    this.errorChart(),
    {
      id: '8',
      type: GridElementType.BUTTON,
      chartData: this.errorData(),
      callback: () => this.nextErrorChart(),
      // title: 'Change Chart Type',
      icon: "fa-pie-chart",
      x: 3,
      y: 4,
      width: 1,
      height: 1,
    },
    this.timelineChart(),
    // {
    //   id: '12',
    //   type: GridElementType.BUTTON,
    //   chartData: this.timelineChartData(),
    //   callback: () => this.nextTimelineChart(),
    //   // title: 'Change Timeline Type',
    //   icon: "fa-area-chart",
    //   x: 7,
    //   y: 2,
    //   width: 1,
    //   height: 1,
    // },
    ...this.filterDialog(),
    {
      id: '15',
      type: GridElementType.BUTTON,
      chartData: this.timelineChartData(),
      callback: () => this.toggleFilterDialog(),
      icon: "fa-filter",
      x: 7,
      y: 0,
      width: 1,
      height: 1,
    },
  ]);

  errorChart = computed(() => {
    const machineData = this.newMachineData();
    const errorChartIndex = this.errorChartIndex();
    return this.getErrorChart();
  });
  timelineChart = computed(() => {
    const machineData = this.newMachineData();
    const timelineChartIndex = this.timelineChartIndex();
    return this.getTimelineChart();
  });

  showFilterDialog: WritableSignal<boolean> = signal(false);
  filterDialog: Signal<GridElement[]> = computed(() => {
    if (this.showFilterDialog()) {
      return [
        {
          id: '13',
          type: GridElementType.PANEL,
          chartData: this.timelineChartData(),
          x: 0,
          y: 0,
          width: 8,
          height: 8,
        },
        {
          id: '14',
          type: GridElementType.DIALOG,
          chartData: this.timelineChartData(),
          component: DataSelection,
          x: 3,
          y: 3,
          height: 2,
          width: 2,
        },
      ]
    } else return [];
  });

  castGridElementChartData<T extends keyof ChartTypeRegistry>(
    element: GridElement
  ) {
    return element.chartData as ChartData<T>;
  }

  castGridElementChartOptions<T extends keyof ChartTypeRegistry>(
    element: GridElement
  ) {
    return element.chartOptions as ChartOptions<T>;
  }

  getErrorChart() {
    const errorCharts: GridElement[] = [
      {
        id: '4',
        type: GridElementType.PIE,
        chartData: this.errorData(),
        chartOptions: this.errorChartOptions,
        x: 0,
        y: 4,
        width: 4,
        height: 4,
      },
      {
        id: '7',
        type: GridElementType.POLAR,
        chartData: {
          ...this.errorData(),
          datasets: [
            {
              ...this.errorData().datasets[0],
              hoverOffset: 0,
            },
          ],
        },
        chartOptions: {
          ...this.errorChartOptions,
          scales: {
            r: {
              ticks: {
                stepSize: 1,
              },
            },
          },
        },
        x: 0,
        y: 4,
        width: 4,
        height: 4,
      },
      {
        id: '6',
        type: GridElementType.RADAR,
        chartData: this.errorRadarData(),
        chartOptions: this.errorRadarOptions,
        x: 0,
        y: 4,
        width: 4,
        height: 4,
      },
    ];
    return errorCharts[this.errorChartIndex()];
  }

  getTimelineChart() {
    const timelineCharts: GridElement[] = [
      {
        id: '10',
        type: GridElementType.BAR,
        chartData: this.timelineChartData(),
        chartOptions: this.timelineChartOptions(),
        x: 4,
        y: 2,
        width: 4,
        height: 2,
      },
      {
        id: '11',
        type: GridElementType.BAR,
        chartData: this.detailedTimelineChartData,
        chartOptions: merge({}, [this.timelineChartOptions, this.detailedTimelineChartOptions]) as ChartOptions<'bar'>,
        x: 4,
        y: 2,
        width: 4,
        height: 2,
      },
    ];

    return timelineCharts[this.timelineChartIndex()];
  }

  nextErrorChart() {
    const errorChartIndex = this.errorChartIndex();
    this.errorChartIndex.set((errorChartIndex + 1) % 3);
  }

  nextTimelineChart() {
    const timelineChartIndex = this.timelineChartIndex();
    this.timelineChartIndex.set((timelineChartIndex + 1) % 2);
  }

  toggleFilterDialog() {
    const showFilterDialog = this.showFilterDialog();
    this.showFilterDialog.set(!showFilterDialog);
  }
}
