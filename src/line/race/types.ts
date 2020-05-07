import { ChartConfig, AxisConfig, Position } from "../../common/types";

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

export interface LineNodeConfig extends Position {
  color?: string;
}

export interface LineRaceConfig extends ChartConfig {
  data?: LineData;
  yAxis?: AxisConfig;
  xAxis?: AxisConfig;
  showNum?: number;
  sortType?: string;
}

export interface LineGroupConfig extends LineRaceConfig, Position {

}

export interface AnimateData {
  value?: number;
  oldValue?: number;
  maxValue?: number;
  oldMaxValue?: number;
}