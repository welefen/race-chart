import { Group } from 'spritejs';

export type ScaleType = 'fixed' | 'dynamic';
export type SortType = 'asc' | 'desc';

export interface Font {
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: string;
  lineHeight?: number;
  color?: string;
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
  src: string;
  width?: number;
  height?: number;
  radius?: number;
  disabled?: boolean;
}
export interface BarRectConfig {
  color?: string;
  minWidth?: number; // 最小宽度
  width?: number; // 实时宽度
}

export interface BarDataItem {
  image?: string;
  label: string;
  values: number[];
  category: string;
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

interface Position {
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
  barColumn?: BarColumnConfig;
  barTotal?: BarTotalConfig;
  duration?: number; // 单个动画时长
  alignSpacing?: number;
  justifySpacing?: number;
  scaleType?: ScaleType;
  showNum?: number; // show bars num
  colors?: string[]; // bar colors
  data?: BarData;
  sortType?: SortType;
  padding?: number | number[];
  background?: Background;
  captureStream?: boolean;
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
  valueSplit?: ValueSplitConfig;
  justifySpacing?: number;
}

export interface ColumnTipConfig extends Position {
  barColumn?: BarColumnConfig;
  barTotal?: BarTotalConfig;
  valueSplit?: ValueSplitConfig;
}


export interface CanvasElement extends HTMLCanvasElement {
  captureStream(): void;
}

export interface MediaRecorderEvent {
  data: {
    size: number
  }
}

export interface Deferred {
  promise?: Promise<any>;
  resolve?: (value?: any) => void;
  reject?: (reason?: any) => void;
}