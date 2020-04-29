export type Align = 'left' | 'center' | 'right';
export type Formatter = (value: number, type: string) => string;
export type NumberOrString = number | string;
export type Duration = (...args: NumberOrString[]) => number;
export type ScaleType = 'fixed' | 'dynamic';
export type SortType = 'asc' | 'desc';
export type Status = 'run' | 'stop';
export type AxisType = 'row' | 'column';

export interface Font {
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: string;
  fontStyle?: string;
  fontStretch?: string;
  fontVariant?: string;
  lineHeight?: number;
  color?: string;
  opactiy?: number;
  padding?: [number, number, number, number];
  align?: Align;
}

export interface Position {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}

/**
 * 画布背景
 */
export interface BackgroundConfig {
  color?: string;
  image?: string;
  opacity?: number;
}


export interface WatermarkConfig extends Font, Position {
  image?: string;
  text?: string;
  rotate?: number;
  opacity?: number;
}

export interface OpeningImageConfig {
  image?: string;
  time?: number;
  disabled?: boolean;
}

export interface EndingImageConfig extends OpeningImageConfig {

}


export interface TitleConfig extends Font, Position {
  text?: string;
}

export interface SubTitleConfig extends TitleConfig {

}

export interface ChartConfig {
  selector?: string | HTMLElement; // 选择器
  width?: number;
  height?: number;
  displayRatio?: number;
  padding?: number | number[];
  background?: BackgroundConfig; // 背景
  watermark?: WatermarkConfig; // 水印
  openingImage?: OpeningImageConfig; // 片头
  endingImage?: EndingImageConfig; // 片尾
  colors?: string[]; // 颜色列表
  title?: TitleConfig; // 标题
  subTitle?: SubTitleConfig; //副标题
  duration?: number | Duration;
}

export interface AxisConfig extends Font, Position {
  type?: AxisType;
  maxTick?: number; // 最多显示几个
  lineColor?: string;
  tipHeight?: number;
  formatter?: Formatter;
}