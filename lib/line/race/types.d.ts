import { ChartConfig, AxisConfig, Position, Font, Formatter } from "../../common/types";
declare type ScoreType = 'score' | 'rank';
export interface LineDataItem {
    image?: string;
    label?: string;
    values?: number[];
    category?: string;
}
export interface LineData {
    columnNames?: string[];
    data?: LineDataItem[];
}
export interface lineLineConfig {
    color?: string;
    width?: number;
    shadeWidth?: number;
    shadeOpacity?: number;
}
export interface lineCircleConfig {
    radius?: number;
    image?: string;
}
export interface lineLabelConfig extends Font {
    text?: string;
    width?: number;
}
export interface lineValueConfig extends Font {
    pos?: string;
    formatter?: Formatter;
}
export interface LineNodeConfig extends Position {
    line?: lineLineConfig;
    circle?: lineCircleConfig;
    label?: lineLabelConfig;
    value?: lineValueConfig;
    justifySpacing?: number;
}
export interface LineRaceConfig extends ChartConfig {
    data?: LineData;
    yAxis?: AxisConfig;
    xAxis?: AxisConfig;
    scoreType?: ScoreType;
    line?: LineNodeConfig;
}
export interface LineGroupConfig extends LineRaceConfig, Position {
}
export {};
