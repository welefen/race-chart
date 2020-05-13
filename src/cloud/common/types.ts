import { ChartConfig, Font } from '../../common/types';

export interface MaskConfig extends Font {
  image?: string;
  text?: string;
}

export interface CloudDataItem {
  image?: string;
  text?: string;
  value?: number;
}

export interface CloudConfig extends ChartConfig {
  mask?: MaskConfig;
  data?: CloudDataItem[];
  gridSize?: number;
  minSize?: number;
  color?: string;
}