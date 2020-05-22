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
}
export interface CloudRotate {
  disabled?: boolean;
  min?: number;
  max?: number;
  step?: number;
}

export interface CloudWordConfig {
  text?: string;
  color?: string;
  deg?: number;
  fontSize?: number;
  preFontSize?: number;
  shrinks?: number;
}

export interface CloudConfig extends ChartConfig {
  mask?: MaskConfig;
  data?: CloudDataItem[];
  gridSize?: number;
  weightFactor?: number;
  minFontSize?: number;
  maxFontSize?: number;
  textStyle?: Font;
  debug?: {
    drawGridItems?: boolean;
    drawMaskImage?: boolean;
    drawPoints?: boolean;
  };
  rotate?: CloudRotate;
  autoShrink?: boolean;
  delay?: number;
  shrinkPercent?: number;
  shufflePoints?: boolean;
}