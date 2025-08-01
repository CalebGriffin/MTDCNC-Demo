import { NewDataPoint } from "./data-point";

export interface MachineWeekData {
  metadata: {
    generatedAt: string;
    startTime: string;
    endTime: string;
    intervalSeconds: number;
    totalDataPoints: number;
    statusDefinitions: Record<number, string>;
    errorCodes: Record<number, string>;
  };
  data: NewDataPoint[];
}