import { BarTrendConfig } from '../common/types';
import { Position } from '../../common/types';


export interface BarDataItem {
  label?: string;
  image?: string;
  value?: number;
  ext?: Record<string, any>;
}

export interface BarRankConfig extends BarTrendConfig {
  data?: BarDataItem[];
}

export interface AnimateData {
  width?: number;
  newWidth?: number;
  maxValue?: number;
  pos?: number;
  newPos?: number;
  opacity?: number;
}

export interface BarsConfig extends BarRankConfig, Position {

}