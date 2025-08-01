import { Injectable, output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalsService {
  public readonly ERROR_TYPES: Record<number, string> = {
    0: "No Error",
    1: "Machine Fault",
    2: "Material Shortage",
    3: "Operator Error",
    4: "Maintenance",
    5: "Material Fault",
    6: "Power Issue",
  };
  get ERROR_TYPE_LABELS(): string[] {
    return Object.values(this.ERROR_TYPES);
  }
  
  public readonly operatingPowerInKWH = 2;
  public readonly idlePowerInKWH = 0.5;
  public readonly targetPowerConsumptionInKWH = 1000;

  public filteredMachines: boolean[] = Array(4).fill(true);

  public toggleMachineFilter(index: number) {
    this.filteredMachines[index] = !this.filteredMachines[index];
  }
}
