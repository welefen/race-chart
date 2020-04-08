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

export const defaultBarsConfig: BarsConfig = {
  width: 300,
  height: 200,
  showNum: 10,
  alignSpacing: 5,
  justifySpacing: 5,
  duration: 2000,
  x: 0,
  y: 0,
  colors: '#1D6996|#EDAD08|#73AF48|#94346E|#38A6A5|#E17C05|#5F4690|#0F8554|#6F4070|#CC503E|#994E95|#666666'.split('|'),
  scaleType: 'dynamic',
  barLabel: {
    width: 100
  },
  barValue: {
    width: 100
  }
}

export const defaultBarConfig: BarConfig = {
  x: 0,
  y: 0,
  width: 100,
  height: 30,
  spacing: 5, // name, rect, value 之间的间距
  label: {
    text: 'name',
    fontSize: 16,
    fontFamily: '"宋体"',
    color: '#333',
    width: 100
  },
  value: {
    value: 0,
    fontSize: 14,
    fontFamily: '"宋体"',
    color: '#333',
    width: 100,
    split: {
      type: ',',
      length: 3
    }
  },
  rect: {
    minWidth: 10,
    width: 0,
    color: 'red',
  }
}