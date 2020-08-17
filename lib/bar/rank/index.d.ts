import { BarChart } from '../common/barChart';
import { BarRankConfig } from './types';
export declare class BarRank extends BarChart {
    private barGroup;
    config: BarRankConfig;
    setConfig(config: BarRankConfig): void;
    private initMaxValues;
    private renderBars;
    render(): Promise<void>;
    start(): Promise<void>;
    protected onUpdate(percent: number): void;
    beforeAnimate(): void;
    afterAnimate(): void;
}
