import { Group } from 'spritejs';
export declare type Align = 'left' | 'center' | 'right';
export declare type Formatter = (value: number, type: string) => string;
export declare type NumberOrString = number | string;
export declare type Duration = (...args: NumberOrString[]) => number;
export declare type ScaleType = 'fixed' | 'dynamic';
export declare type SortType = 'asc' | 'desc';
export declare type Status = 'run' | 'stop';
export declare type AxisType = 'row' | 'column';
export declare type AxisLabelPosition = 'top' | 'bottom';
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
    rotate?: number;
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
    selector?: string | HTMLElement;
    width?: number;
    height?: number;
    displayRatio?: number;
    padding?: number | number[];
    background?: BackgroundConfig;
    watermark?: WatermarkConfig;
    openingImage?: OpeningImageConfig;
    endingImage?: EndingImageConfig;
    colors?: string[];
    title?: TitleConfig;
    subTitle?: SubTitleConfig;
    duration?: number | Duration;
    lastStayTime?: number;
}
export interface AxisLabelConfig extends Font {
    text?: string;
    pos?: AxisLabelPosition;
    width?: number;
    height?: number;
    formatter?: Formatter;
}
export interface AxisLineConfig {
    color?: string;
    width?: number;
}
export interface AxisConfig extends Position {
    type?: AxisType;
    maxTick?: number;
    label?: AxisLabelConfig;
    line?: AxisLineConfig;
}
export interface AxisTick {
    value?: number;
    label?: string;
    remove?: boolean;
    group?: Group;
}
export interface AnimateConfig {
    maxValue?: number;
    oldMaxValue?: number;
    index?: number;
    percent?: number;
}
