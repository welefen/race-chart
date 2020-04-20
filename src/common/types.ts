
export type Align = 'left' | 'center' | 'right';

export type Formatter = (value: number, type: string) => string;


/**
 * 字体，其他地方继承
 */
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
  padding?: number[];
  align?: Align;
}

/**
 * 位置，其他地方继承
 */
export interface Position {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}

/**
 * 画布背景
 */
export interface Background {
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

export interface TimeData {
  time: number;
}

export interface Config {
  selector?: string | HTMLElement; // 选择器
  width?: number;
  height?: number;
  displayRatio?: number;
  padding?: number | number[];
  background?: Background; // 背景
  watermark?: WatermarkConfig; // 水印
  openingImage?: OpeningImageConfig; // 片头
  endingImage?: EndingImageConfig; // 片尾
  colors?: string[]; // 颜色列表
  title?: TitleConfig; // 标题
  subTitle?: SubTitleConfig; //副标题
}