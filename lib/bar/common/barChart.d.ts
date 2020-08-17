import { BarChartConfig } from './types';
import { DynamicAxis } from '../../common/axis/dynamic';
import { Chart } from '../../common/chart';
export declare class BarChart extends Chart {
    maxValues: number[];
    index: number;
    config: BarChartConfig;
    axis: DynamicAxis;
    protected renderAxis(x: number, y: number, width: number, height: number): void;
}
