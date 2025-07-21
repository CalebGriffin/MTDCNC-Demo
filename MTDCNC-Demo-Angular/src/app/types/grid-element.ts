import { ChartData, ChartOptions } from "chart.js";
import { GridElementType } from "./grid-element-type";

export interface GridElement {
  id: string;
  type: GridElementType;
  chartData: ChartData;
  chartOptions?: ChartOptions;
  callback?: () => void;
  title?: string;
  x: number;
  y: number;
  width: number;
  height: number;
}