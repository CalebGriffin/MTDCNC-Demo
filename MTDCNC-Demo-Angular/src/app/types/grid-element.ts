import { ChartData, ChartOptions } from "chart.js";
import { GridElementType } from "./grid-element-type";
import { Type } from "@angular/core";

export interface GridElement {
  id: string;
  type: GridElementType;
  chartData: ChartData;
  chartOptions?: ChartOptions;
  callback?: () => void;
  component?: Type<any> | null;
  title?: string;
  icon?: string;
  x: number;
  y: number;
  width: number;
  height: number;
}