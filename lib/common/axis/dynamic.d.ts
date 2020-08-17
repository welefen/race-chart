import { BaseAxis } from './base';
import { AxisTick, AnimateConfig } from '../types';
export declare class DynamicAxis extends BaseAxis {
    private maxValue;
    private step;
    private getFormatValue;
    private getSteps;
    private updateTicksPos;
    protected addTicks(ticks: AxisTick[]): void;
    beforeAnimate(data: AnimateConfig): void;
    onUpdate(data: AnimateConfig): void;
    afterAnimate(data: AnimateConfig): void;
}
