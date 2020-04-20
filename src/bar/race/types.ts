import { BarTrendConfig } from '../common/types';
import { Position } from '../../common/types';

export interface BarDataItem {
  image?: string;
  label?: string;
  index?: number; // 在数组中的位置
  values?: number[];
  category?: string;
}
export interface BarData {
  columnNames?: string[];
  data?: BarDataItem[],
  totalValues?: number[]
}

export interface AnimateData {
  value?: number;
  width?: number;
  index?: number;
  newIndex?: number;
  pos?: number;
  newPos?: number;
}

export interface BarRaceConfig extends BarTrendConfig {
  data?: BarData;
}

export interface BarsConfig extends BarRaceConfig, Position {

}