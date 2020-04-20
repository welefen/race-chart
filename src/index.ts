import { Scene, Layer, Rect, Sprite, } from "spritejs";
import Events from 'eventemitter3';
import { deepmerge } from './util';

import { Bars } from './bars';
import { parseData, sortValues, parseCombineValue, createLabel } from './util';
import { Timer } from './timer';
import { BarRaceConfig, TitleConfig, STATUS } from './type';
import { defaultBarRace } from './config';
import { Axis } from './axis';
import { ColumnTip } from './columnTip';
import { Watermark } from './watermark';
export class BarRace extends Events {
  private timer: Timer;
  private bars: Bars;
  private axis: Axis;
  private status: STATUS = 'run';
  private columnTip: ColumnTip;
  scene: Scene;
  layer: Layer;
  config: BarRaceConfig = {};
  index: number = 0; // 当前所在的数据 index
  values: number[] = []; //当前 index 所在的 values
  maxValues: number[]; // 最大的 values 列表
  constructor(config: BarRaceConfig) {
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
  setConfig(config: BarRaceConfig) {
    this.config = deepmerge({}, defaultBarRace, this.config, config);
    this.config.padding = parseCombineValue(this.config.padding);
    this.config.data = parseData(this.config.data, this.config.showNum);
    // 按第一个数据从大到小排序
    sortValues(this.config.data.data, 0, this.config.sortType);
    // 可能数据长度不足 showNum 的大小
    this.config.showNum = Math.min(this.config.showNum, this.config.data.data.length);
    if (typeof this.config.selector === 'string') {
      this.config.selector = <HTMLElement>document.querySelector(<string>this.config.selector);
    }
    this.timer = new Timer(<number>this.config.duration, this.onUpdate.bind(this));
    this.initMaxValues();
  }
  private initMaxValues() {
    const { columnNames, data } = this.config.data;
    let values: number[] = columnNames.map((_, idx) => {
      const values = data.map(item => item.values[idx]);
      return Math.max(...values);
    })
    if (this.config.scaleType === 'fixed') {
      const max = Math.max(...values);
      values = [...new Array(columnNames.length)].fill(max);
    }
    this.maxValues = values;
  }
  // 渲染背景
  private async renderBackground() {
    const { image, color, opacity } = this.config.background;
    const { width, height } = this.config;
    if (color) {
      const rect = new Rect({
        fillColor: color,
        width, height, opacity
      })
      this.layer.appendChild(rect);
    }
    if (image) {
      const id = 'bg';
      await this.scene.preload({
        id,
        src: image,
      });
      const sprite = new Sprite({
        texture: id,
        width, height,
        opacity
      })
      this.layer.appendChild(sprite);
    }
  }
  private async renderTitle(config: TitleConfig): Promise<number> {
    if (!config.text) return 0;
    const label = createLabel(config.text, config);
    const { x, y, width, padding, align } = config;
    label.attr({
      x,
      y,
      width,
      padding,
      textAlign: align
    })
    this.layer.appendChild(label);
    await label.textImageReady;
    return label.clientSize[1];
  }
  private renderAxis(x: number, y: number, width: number, height: number) {
    const { barLabel, justifySpacing, formatter, barValue, axis } = this.config;
    this.axis = new Axis({
      x: x + barLabel.width + justifySpacing,
      y,
      width: width - barLabel.width - justifySpacing * 2 - barValue.width,
      height,
      formatter,
      ...axis
    });
    this.axis.appendTo(this.layer);
  }
  private renderBars(x: number, y: number, width: number, height: number) {
    const { tipHeight } = this.config.axis;
    this.bars = new Bars({
      ...this.config,
      x,
      y: y + tipHeight,
      width,
      height: height - tipHeight,
    });
    return this.bars.appendTo(this.layer);
  }
  private renderColumnTip(x: number, y: number, width: number, height: number) {
    const { barTotal, barColumn, barValue, formatter } = this.config;
    this.columnTip = new ColumnTip({
      x,
      y,
      width,
      height,
      barTotal,
      barColumn,
      formatter
    });
    return this.columnTip.appendTo(this.layer);
  }
  private renderWatermark(): Promise<Watermark> {
    const watermark = new Watermark({
      x: 0,
      y: 0,
      width: this.config.width,
      height: this.config.height,
      ...this.config.watermark
    })
    return watermark.appendTo(this.layer).then(_ => watermark);
  }
  private async renderPrefix(): Promise<void> {
    const { image, opacity, time } = this.config.prefix;
    if (!image) return;
    const sprite = new Sprite({
      texture: image,
      opacity,
      width: this.config.width,
      height: this.config.height
    })
    this.layer.appendChild(sprite);
    await sprite.textureImageReady;
    return new Promise(resolve => {
      setTimeout(() => {
        resolve();
        this.layer.removeChild(sprite);
      }, time);
    })
  }
  private async render() {
    this.layer.removeAllChildren();
    await this.renderPrefix();
    await this.renderBackground();
    await this.renderWatermark();
    let [y, paddingRight, paddingBottom, x] = <number[]>this.config.padding;
    let width = this.config.width - x - paddingRight;
    let height = this.config.height - y - paddingBottom;
    const titleHeight = await this.renderTitle({
      ...this.config.title,
      x, y, width, height
    })
    y += titleHeight;
    height -= titleHeight;
    const subTitleHeight = await this.renderTitle({
      ...this.config.subTitle,
      x, y, width, height
    })
    y += subTitleHeight;
    height -= subTitleHeight;

    this.renderAxis(x, y, width, height);
    await this.renderBars(x, y, width, height);
    await this.renderColumnTip(x, y, width, height);
    this.beforeAnimate();
    this.afterAnimate();
  }
  async start() {
    await this.render();
    this.emit('start');
    const length = this.config.data.columnNames.length;
    let { duration } = this.config;
    while (this.index < length) {
      if (this.status === 'stop') {
        this.emit('stop');
        return;
      };
      const column = this.config.data.columnNames[this.index];
      this.emit('change', column);
      this.beforeAnimate();
      const dur = typeof duration === 'function' ? duration(column, this.index, length) : duration;
      await this.timer.start(dur);
      this.afterAnimate();
      this.index++;
    }
    const { lastStayTime } = this.config;
    if (lastStayTime && this.status !== 'stop') {
      await this.timer.start(lastStayTime, _ => {
        this.columnTip.columnOpacity = Math.random() > 0.5 ? 0.95 : 1;
      })
    }
    this.emit('end');
    if (this.config.loop) {
      this.index = 0;
      return this.start();
    }
  }
  stop() {
    this.status = 'stop';
    this.timer.stop();
  }
  restart() {
    this.status = 'run';
    this.index = 0;
    return this.start();
  }
  private beforeAnimate() {
    sortValues(this.config.data.data, this.index, this.config.sortType);
    // 值可能会出现相同的情况
    this.values = this.config.data.data.map(item => item.values[this.index]);
    this.bars.beforeAnimate(this);
    this.columnTip.beforeAnimate(this);
    this.axis.beforeAnimate(this);
  }
  private afterAnimate() {
    this.bars.afterAnimate(this);
    this.axis.afterAnimate(this);
  }
  private onUpdate(percent: number) {
    this.bars.update(this, percent);
    this.columnTip.update(this, percent);
    this.axis.update(this, percent);
  }
}