import { Scene, Layer } from 'spritejs';
import Events from 'eventemitter3';
import { Timer } from './timer';
import { TitleConfig } from './types';
import { ChartConfig } from './types';
export declare class Chart extends Events {
    protected timer: Timer;
    config: ChartConfig;
    scene: Scene;
    layer: Layer;
    constructor(config: ChartConfig);
    setConfig(config: ChartConfig): void;
    protected preload(): Promise<void>;
    protected renderWatermark(): Promise<void>;
    protected renderBackground(): void;
    /**
     * 渲染片头图片
     */
    protected renderOpeningImage(): Promise<void>;
    /**
     * 标题
     * @param config
     */
    protected renderTitle(config: TitleConfig): Promise<number>;
    /**
     * 片尾
     */
    protected renderEndingImage(): Promise<unknown>;
    render(): Promise<void>;
    /**
     * 最后停留时间
     */
    protected renderLastStayTime(): Promise<void>;
    protected onUpdate(percent: number): void;
}
