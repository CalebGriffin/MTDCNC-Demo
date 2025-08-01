import { Injectable } from "@angular/core";
import { NewMachineData } from "../types/machine-data";
import Machine1_Week1 from "./../static/machine-1_week-1.json";
import Machine2_Week1 from "./../static/machine-2_week-1.json";
import Machine3_Week1 from "./../static/machine-3_week-1.json";
import Machine4_Week1 from "./../static/machine-4_week-1.json";
import { MachineWeekData } from "../types/machine-week-data";

@Injectable({
  providedIn: 'root'
})
export class DataFetchingService {
  private readonly machineData: Record<string, NewMachineData> = {
    machine1Week1: {
      machineName: "Machine 1",
      dataPoints: (Machine1_Week1 as MachineWeekData).data
    },
    machine2Week1: {
      machineName: "Machine 2", 
      dataPoints: (Machine2_Week1 as MachineWeekData).data
    },
    machine3Week1: {
      machineName: "Machine 3",
      dataPoints: (Machine3_Week1 as MachineWeekData).data
    },
    machine4Week1: {
      machineName: "Machine 4",
      dataPoints: (Machine4_Week1 as MachineWeekData).data
    }
  };

  get machine1Week1Data(): NewMachineData {
    return this.machineData["machine1Week1"];
  }

  get machine2Week1Data(): NewMachineData {
    return this.machineData["machine2Week1"];
  }

  get machine3Week1Data(): NewMachineData {
    return this.machineData["machine3Week1"];
  }

  get machine4Week1Data(): NewMachineData {
    return this.machineData["machine4Week1"];
  }

  getAllMachineData(): NewMachineData[] {
    return Object.values(this.machineData);
  }

  getMachineByName(machineName: string): NewMachineData | undefined {
    return Object.values(this.machineData)
      .find(machine => machine.machineName === machineName);
  }
}