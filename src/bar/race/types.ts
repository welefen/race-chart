import { BarTrendConfig, BarConfig as BarConfigDefault } from '../common/types';
import { Formatter, Position, Font } from '../../common/types';

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

export interface BarColumnConfig extends Font {
  disabled?: boolean;
  text?: string;
}

export interface BarTotalConfig extends Font {
  disabled?: boolean; // 是否显示
  value?: number;
  prefix?: string; // 前缀
  formatter?: Formatter;
}


export interface BarConfig extends BarConfigDefault {
  total?: BarTotalConfig;
  column?: BarColumnConfig;
}

export interface BarRaceConfig extends BarTrendConfig {
  bar?: BarConfig;
  data?: BarData;
}

export interface BarsConfig extends BarRaceConfig, Position {

}