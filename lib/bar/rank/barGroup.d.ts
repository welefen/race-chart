import { BarsConfig } from './types';
import { Group, Layer } from 'spritejs';
import { BarNode } from '../common/barNode';
import { BarRank } from './index';
export declare class BarGroup {
    private animateData;
    private rectMaxWidth;
    private barHeight;
    config: BarsConfig;
    group: Group;
    bars: BarNode[];
    constructor(config: BarsConfig);
    private createBar;
    beforeAnimate(barRank: BarRank): Promise<void>;
    onUpdate(barRank: BarRank, percent: number): void;
    afterAnimate(barRank: BarRank): void;
    appendTo(layer: Layer): Promise<void>;
    private getBarY;
}
