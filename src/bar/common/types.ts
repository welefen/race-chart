import { Config, Font, Position, Formatter } from '../../common/types';
import { Group } from 'spritejs';


export type ScaleType = 'fixed' | 'dynamic';
export type SortType = 'asc' | 'desc';
export type Status = 'run' | 'stop';
export type NumberOrString = number | string;

export type Duration = (...args: NumberOrString[]) => number;

export interface AxisConfig extends Font, Position {
  maxTick?: number; // 最多显示几个
  lineColor?: string;
  tipHeight?: number;
  formatter?: Formatter;
}

export interface AxisTick {
  value?: number;
  remove?: boolean;
  group?: Group;
}

export interface BarColumnConfig extends Font {
  disabled?: boolean;
  text?: string;
}

export interface BarTotalConfig extends Font {
  disabled?: boolean; // 是否显示
  value?: number;
  prefix?: string; // 前缀
  formatter?: Formatter;
}

export interface BarLabelConfig extends Font {
  text?: string;
  width?: number;
}

export interface BarValueConfig extends Font {
  value?: number;
  width?: number;
  formatter?: Formatter;
}

export type BarType = '2d' | '3d';

export interface BarLogoConfig {
  image?: string;
  opacity?: number;
  disabled?: boolean;
  deltaSize?: number;
  borderSize?: number;
}

export interface BarRectConfig {
  color?: string;
  minWidth?: number; // 最小宽度
  width?: number; // 实时宽度
  radius?: number; // 圆角，2d 下有效
  angle?: number; // 角度，3d 下有效
  sideHeight?: number; // 3d 下有效
  type?: BarType;
}

export interface BarConfig extends Position {
  alignSpacing?: number; // 垂直间距
  justifySpacing?: number; // 水平间距
  label?: BarLabelConfig;
  value?: BarValueConfig;
  logo?: BarLogoConfig;
  rect?: BarRectConfig;
  total?: BarTotalConfig;
  column?: BarColumnConfig;
  color?: string;
}

export interface BarTrendConfig extends Config {
  axis?: AxisConfig,
  showNum?: number; // 展现的条数
  scaleType?: ScaleType; // bar 缩放方式
  sortType?: SortType; // 数据排序方式
  formatter?: Formatter; //数据格式化函数
  bar?: BarConfig;
  lastStayTime?: number;
  duration?: number | Duration;
}

