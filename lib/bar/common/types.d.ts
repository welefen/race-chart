import { ChartConfig, Font, Position, Formatter, ScaleType, SortType, AxisConfig } from '../../common/types';
export interface BarLabelConfig extends Font {
    text?: string;
    width?: number;
}
export interface BarValueConfig extends Font {
    value?: number;
    width?: number;
    formatter?: Formatter;
}
export declare type BarType = '2d' | '3d';
export interface BarLogoConfig {
    image?: string;
    opacity?: number;
    disabled?: boolean;
    deltaSize?: number;
    borderSize?: number;
}
export interface BarRectConfig {
    color?: string;
    minWidth?: number;
    width?: number;
    radius?: number;
    angle?: number;
    sideHeight?: number;
    type?: BarType;
}
export interface BarDescConfig extends Font {
    text?: string;
    width?: number;
}
export interface BarConfig extends Position {
    alignSpacing?: number;
    justifySpacing?: number;
    label?: BarLabelConfig;
    value?: BarValueConfig;
    logo?: BarLogoConfig;
    rect?: BarRectConfig;
    desc?: BarDescConfig;
    color?: string;
}
export interface BarChartConfig extends ChartConfig {
    axis?: AxisConfig;
    showNum?: number;
    scaleType?: ScaleType;
    sortType?: SortType;
    formatter?: Formatter;
    bar?: BarConfig;
}
