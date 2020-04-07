export interface LabelConfig {
  text: string;
  fontSize?: number;
  fontFamily?: string;
  color?: string;
  width?: number;
}
export interface ValueConfig {
  text: string;
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
export interface rectConfig {
  color?: string;
  minWidth?: number;
  width?: number;
}

export interface BarConfig {
  label: LabelConfig;
  value: ValueConfig;
  rect?: rectConfig;
  logo?: LogoConfig;
  height: number;
  width: number;
  spacing?: number;
}

export interface BarManageConfig {
  x?: number;
  y?: number;
  width?: number; // container height
  height?: number; // container height
  spacing?: number; // spaceing between bars
  showNum?: number; // show bars num
  colors?: string[]; // bar colors
  data?: BarData;
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