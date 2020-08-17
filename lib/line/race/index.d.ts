import { Chart } from '../../common/chart';
import { LineRaceConfig } from './types';
export declare class LineRace extends Chart {
    private index;
    private yAxis;
    private xAxis;
    private lineGroup;
    private maxValues;
    config: LineRaceConfig;
    setConfig(config: LineRaceConfig): void;
    private initMaxValues;
    private renderYAxis;
    private renderXAxis;
    render(): Promise<void>;
    start(): Promise<void>;
    private beforeAnimate;
    protected onUpdate(percent: number): void;
    private afterAnimate;
}
