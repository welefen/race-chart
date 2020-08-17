import { Layer } from 'spritejs';
import { BarRace } from './index';
import { BarsConfig } from './types';
export declare class BarGroup {
    private bars;
    private group;
    private config;
    private rectMaxWidth;
    private barHeight;
    private animateData;
    private totalLabel;
    private totalLabelHeight;
    private columnLabel;
    constructor(config: BarsConfig);
    appendTo(layer: Layer): Promise<void>;
    beforeAnimate(barRace: BarRace): void;
    update(barRace: BarRace, percent: number): void;
    afterAnimate(barRace: BarRace): void;
    private getBarInstance;
    private initBars;
    setTotalText(value: number): Promise<void>;
    private initTotal;
    setColumnText(text: string): void;
    private initColumn;
    private getBarY;
}
