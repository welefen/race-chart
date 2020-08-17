import { BarData, BarDataItem } from './types';
/**
 * 移除完全不会显示的数据，减少创建的 bar 个数
 * @param data
 * @param showNum
 */
export declare function parseData(data: BarData, showNum?: number): BarData;
export declare function sortValues(values: BarDataItem[], index: number, type: string): void;
