import { BarTrendConfig } from './types';
import { Scene, Layer, Rect, Sprite } from 'spritejs';
import Events from 'eventemitter3';
import { createLabel } from '../../common/util';
import { Timer } from '../../common/timer';
import { Watermark } from '../../common/watermark';
import { TitleConfig, Font } from '../../common/types';
import { Axis } from './axis';

export class BarTrend extends Events {
  protected timer: Timer;
  config: BarTrendConfig = {};
  scene: Scene;
  layer: Layer;
  axis: Axis;
  constructor(config: BarTrendConfig) {
    super();
    this.setConfig(config);
    this.scene = new Scene({
      container: this.config.selector,
      width: this.config.width,
      height: this.config.height,
      displayRatio: this.config.displayRatio,
      autoResize: false
    })
    this.layer = this.scene.layer('layer', {
      handleEvent: false
    });
  }
  setConfig(config: BarTrendConfig): void {
    this.config = config;
    this.timer = new Timer(<number>this.config.duration, this.onUpdate.bind(this));
    const { selector } = this.config;
    if (typeof selector === 'string') {
      this.config.selector = <HTMLElement>document.querySelector(<string>selector);
    }
  }
  async preload() {
    const { openingImage, background, endingImage } = this.config;
    const list = [{
      id: 'openingImage',
      src: openingImage.image
    }, {
      id: 'backgroundImage',
      src: background.image
    }, {
      id: 'endingImage',
      src: endingImage.image
    }];
    for (const item of list) {
      if (item.src) {
        await this.scene.preload(item);
      }
    }
  }
  protected renderWatermark(): Promise<void> {
    const { width, height } = this.config;
    const watermark = new Watermark({
      width, height,
      ...this.config.watermark
    })
    return watermark.appendTo(this.layer);
  }
  // 渲染背景
  protected renderBackground(): void {
    const { image, color, opacity } = this.config.background;
    const { width, height } = this.config;
    if (color) {
      const rect = new Rect({
        fillColor: color,
        width, height
      })
      this.layer.appendChild(rect);
    }
    if (image) {
      const sprite = new Sprite({
        texture: 'backgroundImage',
        width, height,
        opacity
      })
      this.layer.appendChild(sprite);
    }
  }
  /**
   * 渲染片头图片
   */
  protected async renderOpeningImage() {
    const { image, time } = this.config.openingImage;
    if (!image) return;
    const sprite = new Sprite({
      texture: 'openingImage',
      width: this.config.width,
      height: this.config.height
    })
    this.layer.appendChild(sprite);
    await sprite.textureImageReady;
    const lastSecondPercent = 1 - 300 / time;
    await this.timer.start(time, percent => {
      if (percent > lastSecondPercent) {
        const opacity = 1 - (percent - lastSecondPercent) / (1 - lastSecondPercent);
        sprite.attr({ opacity })
      }
    });
    this.layer.removeChild(sprite);
  }
  protected async renderTitle(config: TitleConfig): Promise<number> {
    if (!config.text) return 0;
    const label = createLabel(config.text, <Font>config);
    const { x, y, width } = config;
    label.attr({ x, y, width });
    this.layer.appendChild(label);
    await label.textImageReady;
    return label.clientSize[1];
  }

  protected renderAxis(x: number, y: number, width: number, height: number) {
    const { label, justifySpacing, value } = this.config.bar;
    this.axis = new Axis({
      x: x + label.width + justifySpacing,
      y,
      width: width - label.width - justifySpacing * 2 - value.width,
      height,
      formatter: this.config.formatter,
      ...this.config.axis,
    });
    this.axis.appendTo(this.layer);
  }
  async render() {
    await this.preload();
    this.layer.removeAllChildren();
    await this.renderBackground();
    await this.renderWatermark();
    this.emit('start');
    await this.renderOpeningImage();
    this.emit('openingImageEnd')
  }

  protected onUpdate(percent: number): void {

  }
}