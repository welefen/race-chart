import { ChartConfig, AxisConfig } from "../../common/types";

export interface LineDataItem {
  image?: string;
  label?: string;
  values?: number[];
  category?: string;
}
export interface LineData {
  columnNames?: string[];
  data?: LineDataItem[];
}

export interface LineRaceConfig extends ChartConfig {
  data?: LineData;
  yAxis?: AxisConfig;
  xAxis?: AxisConfig;
}