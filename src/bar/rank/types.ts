import { BarTrendConfig, BarConfig as BarConfigDefault } from '../common/types';
import { Position, Font } from '../../common/types';

export type Formatter = (value: number) => string;


export interface BarDataItem {
  label?: string;
  image?: string;
  value?: number;
  ext?: Record<string, any>;
}

export interface BarRankConfig extends BarTrendConfig {
  data?: BarDataItem[];
  bar?: BarConfig;
  delay?: number;
}

export interface AnimateData {
  width?: number;
  newWidth?: number;
  maxValue?: number;
  pos?: number;
  newPos?: number;
  opacity?: number;
}

export interface RankConfig extends Font {
  formatter?: Formatter;
}

export interface BarConfig extends BarConfigDefault {
  rank?: RankConfig
}

export interface BarsConfig extends BarRankConfig, Position {

}