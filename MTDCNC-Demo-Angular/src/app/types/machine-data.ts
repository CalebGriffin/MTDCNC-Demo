import { DataPoint, NewDataPoint } from "./data-point";

export interface MachineData {
  machineName: string;
  dataPoints: DataPoint[];
}

export interface NewMachineData {
  machineName: string;
  dataPoints: NewDataPoint[];
}