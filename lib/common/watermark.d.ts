import { WatermarkConfig } from './types';
import { Layer } from 'spritejs';
export declare class Watermark {
    private config;
    private group;
    constructor(config: WatermarkConfig);
    appendTo(layer: Layer): Promise<void>;
    private create;
}
