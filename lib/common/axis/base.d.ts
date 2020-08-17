import { AxisConfig, AxisTick, AnimateConfig } from "../types";
import { Layer, Group } from 'spritejs';
export declare class BaseAxis {
    protected group: Group;
    protected ticks: AxisTick[];
    protected config: AxisConfig;
    constructor(config: AxisConfig);
    appendTo(layer: Layer): void;
    private generateColumnTick;
    private generateRowTick;
    private generateTick;
    protected addTicks(ticks: AxisTick[]): void;
    protected beforeAnimate(data: AnimateConfig): void;
    protected onUpdate(data: AnimateConfig): void;
    protected afterAnimate(data: AnimateConfig): void;
}
