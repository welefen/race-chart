import { ChartConfig, Font } from '../../common/types';
import { Label, Sprite } from 'spritejs';

export interface MaskConfig extends Font {
  image?: string;
  text?: string;
}

export interface CloudDataItem {
  image?: string;
  text?: string;
  value?: number;
}

export interface Placement {
  row?: number;
  column?: number;
}

export interface CloudItemInfo {
  canvas?: HTMLCanvasElement;
  width?: number;
  height?: number;
  gridWidth?: number;
  gridHeight?: number;
  occupied?: Placement[];
  fontSize?: number;
}
export interface CloudRotate {
  disabled?: boolean;
  min?: number;
  max?: number;
  step?: number;
}

export interface CloudConfig extends ChartConfig {
  mask?: MaskConfig;
  data?: CloudDataItem[];
  gridSize?: number;
  weightFactor?: number;
  minFontSize?: number;
  maxFontSize?: number;
  textStyle?: Font;
  debug?: boolean;
  rotate?: CloudRotate;
  autoShrink?: boolean;
  shrinkPercent?: number;
}