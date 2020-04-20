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
  value?: number;
  width?: number;
  index?: number;
  pos?: number;
}

export interface BarsConfig extends BarRankConfig, Position {

}