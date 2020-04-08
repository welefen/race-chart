export interface LabelConfig {
  text?: string;
  fontSize?: number;
  fontFamily?: string;
  color?: string;
  width?: number;
}
export interface ValueConfig {
  value?: number;
  fontSize?: number;
  fontFamily?: string;
  color?: string;
  split?: ValueSplitConfig;
  width?: number;
  textHeight?: number;
}

export interface ValueSplitConfig {
  type?: string;
  length?: number;
}


export interface LogoConfig {
  src: string;
  width?: number;
  height?: number;
  radius?: number;
  disable?: boolean;
}
export interface RectConfig {
  color?: string;
  minWidth?: number;
  width?: number;
}

export interface BarConfig {
  x?: number; // group x
  y?: number; // group y
  label: LabelConfig;
  value: ValueConfig;
  rect?: RectConfig;
  logo?: LogoConfig;
  height: number;
  width: number;
  spacing?: number;
  values?: number[];
  index?: number;
}

export interface BarsConfig {
  x?: number;
  y?: number;
  width?: number; // container height
  height?: number; // container height
  alignSpacing?: number; // spacing between bars
  justifySpacing?: number; // spacing beween label, rect, value
  showNum?: number; // show bars num
  colors?: string[]; // bar colors
  data?: BarData;
  barLabel?: LabelConfig;
  barValue?: ValueConfig;
  barLogo?: LogoConfig;
  scaleType?: 'fixed' | 'dynamic';
  duration?: number; // 单个动画时长
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