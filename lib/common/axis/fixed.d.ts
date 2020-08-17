import { BaseAxis } from './base';
import { AnimateConfig } from '../types';
export declare class FixedAxis extends BaseAxis {
    private columns;
    private itemWidth;
    private maxTick;
    initTicks(columns: string[]): void;
    beforeAnimate(data: AnimateConfig): void;
    onUpdate(data: AnimateConfig): void;
    afterAnimate(data: AnimateConfig): void;
}
