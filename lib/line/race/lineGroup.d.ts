import { LineGroupConfig } from './types';
import { Layer } from 'spritejs';
import { AnimateConfig } from '../../common/types';
export declare class LineGroup {
    private config;
    private group;
    private lineNodes;
    constructor(config: LineGroupConfig);
    initLineNodes(): void;
    onUpdate(data: AnimateConfig): void;
    afterAnimate(): void;
    appendTo(layer: Layer): void;
}
