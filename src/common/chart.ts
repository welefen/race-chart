import { Scene, Layer, Rect, Sprite } from 'spritejs';
import Events from 'eventemitter3';
import { createLabel } from './util';
import { Timer } from './timer';
import { Watermark } from './watermark';
import { TitleConfig, Font } from './types';
import { ChartConfig } from './types';

export class Chart extends Events {
  protected timer: Timer;
  config: ChartConfig;
  scene: Scene;
  layer: Layer;
  constructor(config: ChartConfig) {
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
  setConfig(config: ChartConfig): void {
    this.config = config;
    const { selector, duration } = this.config;
    this.timer = new Timer(<number>duration, this.onUpdate.bind(this));
    if (typeof selector === 'string') {
      this.config.selector = <HTMLElement>document.querySelector(<string>selector);
    }
  }
  protected async preload() {
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

  protected async renderEndingImage() {
    const { image, time } = this.config.endingImage;
    if (!image) return;
    this.layer.removeAllChildren();
    const sprite = new Sprite({
      texture: 'endingImage',
      width: this.config.width,
      height: this.config.height
    })
    this.layer.appendChild(sprite);
    await sprite.textureImageReady;
    const lastSecondPercent = 1 - 300 / time;
    return this.timer.start(time, percent => {
      if (percent > lastSecondPercent) {
        sprite.attr({ opacity: Math.random() > 0.5 ? 0.98 : 1 });
      }
    });
  }

  async render() {
    await this.preload();
    this.layer.removeAllChildren();
    await this.renderBackground();
    await this.renderWatermark();
    this.emit('start');
    await this.renderOpeningImage();
    this.emit('startRace')
  }

  protected onUpdate(percent: number): void {

  }
}