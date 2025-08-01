import { computed, effect, inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { DataFetchingService } from './data-fetching-service';
import { NewMachineData } from '../types/machine-data';

@Injectable({
  providedIn: 'root'
})
export class DataFilterService {
  private readonly dataFetchService = inject(DataFetchingService);

  public filteredMachines: WritableSignal<boolean[]> = signal(Array(4).fill(true));
  public readonly minStartDate = new Date(Date.UTC(2025, 6, 21));
  public readonly formattedMinStartDate = this.minStartDate.toISOString().slice(0, 16);
  public startDate: WritableSignal<Date> = signal(this.minStartDate);
  public readonly formattedStartDate: Signal<string> = computed(() => {
    return this.startDate().toISOString().slice(0, 16);
  });
  public readonly maxEndDate = new Date(Date.UTC(2025, 6, 28));
  public readonly formattedMaxEndDate = this.maxEndDate.toISOString().slice(0, 16);
  public endDate: WritableSignal<Date> = signal(this.maxEndDate);
  public readonly formattedEndDate: Signal<string> = computed(() => {
    return this.endDate().toISOString().slice(0, 16);
  });
  public machineData = computed(() => {
    const filteredMachines = this.filteredMachines();
    const startDate = this.startDate();
    const endDate = this.endDate();

    return this.filterData(filteredMachines, startDate, endDate);
  });

  constructor() {
    effect(() => {
      console.log(this.filteredMachines());
      console.log(this.machineData());
    });
  }

  public toggleMachineFilter(index: number) {
    console.log("toggle", index);
    const filteredMachines = this.filteredMachines();
    filteredMachines[index] = !filteredMachines[index];
    this.filteredMachines.set([
      ...filteredMachines
    ]);
  }

  private filterData(filteredMachines: boolean[], startDate: Date, endDate: Date): NewMachineData[] {
    const machineData = this.dataFetchService.getAllMachineData();
    const machineFiltered = machineData.filter((_value, index, _arr) => {
      return filteredMachines[index];
    });
    return machineFiltered.map(machineData => {
      return {
        ...machineData,
        dataPoints: machineData.dataPoints.filter(dp => {
          const date = new Date(dp.timestamp);
          return date >= startDate && date <= endDate;
        }),
      }
    })
  }
}
