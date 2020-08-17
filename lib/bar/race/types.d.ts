import { BarChartConfig, BarConfig as BarConfigDefault } from '../common/types';
import { Formatter, Position, Font } from '../../common/types';
export interface BarDataItem {
    image?: string;
    label?: string;
    index?: number;
    values?: number[];
    category?: string;
}
export interface BarData {
    columnNames?: string[];
    data?: BarDataItem[];
    totalValues?: number[];
}
export interface AnimateData {
    value?: number;
    width?: number;
    index?: number;
    newIndex?: number;
    pos?: number;
    newPos?: number;
}
export interface BarColumnConfig extends Font {
    disabled?: boolean;
    text?: string;
}
export interface BarTotalConfig extends Font {
    disabled?: boolean;
    value?: number;
    prefix?: string;
    formatter?: Formatter;
}
export interface BarConfig extends BarConfigDefault {
    total?: BarTotalConfig;
    column?: BarColumnConfig;
}
export interface BarRaceConfig extends BarChartConfig {
    bar?: BarConfig;
    data?: BarData;
}
export interface BarsConfig extends BarRaceConfig, Position {
}
