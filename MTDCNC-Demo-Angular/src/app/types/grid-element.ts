import { ChartData } from "chart.js";
import { GridElementType } from "./grid-element-type";

export interface GridElement {
  id: string;
  type: GridElementType;
  chartData: ChartData;
  x: number;
  y: number;
  width: number;
  height: number;
}