import { Group } from 'spritejs';

export type ScaleType = 'fixed' | 'dynamic';
export type SortType = 'asc' | 'desc';

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
}

export interface BarLabelConfig extends Font {
  text?: string;
  width?: number;
}
export interface BarValueConfig extends Font {
  value?: number;
  width?: number;
}

export interface ValueSplitConfig {
  type?: ',';
  length?: number;
}


export interface BarLogoConfig {
  src?: string;
  width?: number;
  height?: number;
  radius?: number;
  disabled?: boolean;
}
export interface BarRectConfig {
  color?: string;
  minWidth?: number; // 最小宽度
  width?: number; // 实时宽度
  radius?: number;
  type?: '2d' | '3d';
  angle?: number;
  sideHeight?: number;
}

export interface BarDataItem {
  image?: string;
  label: string;
  index?: number; // 在数组中的位置
  values: number[];
  category?: string;
}
export interface BarData {
  columnNames: string[];
  data: BarDataItem[],
  totalValues?: number[]
}

export interface BarColumnConfig extends Font {
  text?: string;
}

export interface BarTotalConfig extends Font {
  disabled?: boolean; // 是否显示
  value?: number;
  prefix?: string; // 前缀
}

interface Axis extends Font {
  maxTick?: number; // 最多显示几个
  lineColor?: string;
  tipHeight: number;
}

type TitleAlign = 'left' | 'center' | 'right';

export interface Position {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}


export interface Tick {
  value: number;
  remove?: boolean;
  group: Group;
}

type Duration = (index: number, length: number) => number;
export interface BarRaceConfig {
  selector?: string; // 选择器
  width?: number;
  height?: number;
  displayRatio?: number;
  valueSplit?: ValueSplitConfig;
  title?: Title;
  subTitle?: SubTitle;
  axis?: Axis;
  barLabel?: BarLabelConfig;
  barRect?: BarRectConfig;
  barValue?: BarValueConfig;
  barLogo?: BarLogoConfig;
  barColumn?: BarColumnConfig;
  barTotal?: BarTotalConfig;
  duration?: number | Duration; // 单个动画时长
  alignSpacing?: number;
  justifySpacing?: number;
  scaleType?: ScaleType;
  showNum?: number; // show bars num
  colors?: string[]; // bar colors
  data?: BarData;
  sortType?: SortType;
  padding?: number | number[];
  background?: Background;
  watermark?: Watermark;
  lastStayTime?: number;
}

export interface Background {
  color?: string;
  image?: string;
}

export interface BackgroundConfig extends Background, Position {

}

export interface AxisConfig extends Axis, Position {
  valueSplit?: ValueSplitConfig
}
export interface Title extends Font {
  text?: string;
  align?: TitleAlign;
  padding?: number[];
}

export interface TitleConfig extends Title, Position {
  width?: number;
}

export interface SubTitle extends Title {

}

export interface SubTitleConfig extends TitleConfig {

}

export interface BarsConfig extends BarRaceConfig, Position {

}
export interface BarConfig extends Position {
  label?: BarLabelConfig;
  rect?: BarRectConfig;
  value?: BarValueConfig;
  logo?: BarLogoConfig;
  valueSplit?: ValueSplitConfig;
  justifySpacing?: number;
}

export interface ColumnTipConfig extends Position {
  barColumn?: BarColumnConfig;
  barTotal?: BarTotalConfig;
  valueSplit?: ValueSplitConfig;
}

export interface Watermark extends Font {
  image?: string;
  text?: string;
  rotate?: number;
  opacity?: number;
}

export interface WatermarkConfig extends Watermark, Position {

}


export interface AnimateData {
  value: number;
  width: number;
  index: number;
  newIndex: number;
  pos: number;
  newPos: number;
}

export interface TimeData {
  time: number;
}