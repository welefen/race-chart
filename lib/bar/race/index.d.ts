import { BarChart } from '../common/barChart';
import { BarRaceConfig } from './types';
import { BarGroup } from './barGroup';
export declare class BarRace extends BarChart {
    private status;
    config: BarRaceConfig;
    values: number[];
    barGroup: BarGroup;
    setConfig(config: BarRaceConfig): void;
    private initMaxValues;
    protected preload(): Promise<void>;
    render(): Promise<void>;
    private renderBars;
    start(): Promise<void>;
    private beforeAnimate;
    private afterAnimate;
    protected onUpdate(percent: number): void;
    stop(): void;
    restart(): Promise<void>;
}
