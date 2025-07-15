import { DataPoint } from "./data-point";

export interface MachineData {
  machineName: string;
  dataPoints: DataPoint[];
}