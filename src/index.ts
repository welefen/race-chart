import { Scene, Layer, Rect, Sprite, Label } from "spritejs";
import { Bars } from './bars';
import { parseData, sortValues, parseCombineValue } from './util';
import { Timer } from './timer';
import { BarRaceConfig, TitleConfig, Deferred, MediaRecorderEvent, CanvasElement } from './type';
import deepmerge from 'ts-deepmerge';
import { defaultBarRace } from './config';
import { Axis } from './axis';
import { ColumnTip } from './columnTip';

declare var MediaRecorder: any;
export class BarRace {
  scene: Scene;
  layer: Layer;
  timer: Timer;
  bars: Bars;
  axis: Axis;
  columnTip: ColumnTip;
  config: BarRaceConfig;
  index: number = 0; // 当前所在的数据 index
  values: number[] = [];
  maxValues: number[];
  deferred: Deferred;
  recorder: any;
  constructor(config: BarRaceConfig) {
    this.config = deepmerge({}, defaultBarRace, config);
    this.config.padding = parseCombineValue(this.config.padding);
    this.config.data = parseData(this.config.data, this.config.showNum);
    // 按第一个数据从大到小排序
    sortValues(this.config.data.data, 0, this.config.sortType);
    // 可能数据长度不足 showNum 的大小
    this.config.showNum = Math.min(this.config.showNum, this.config.data.data.length);
    const scene = new Scene({
      container: document.querySelector(this.config.selector),
      width: this.config.width,
      height: this.config.height,
      displayRatio: this.config.displayRatio,
    })
    this.scene = scene;
    this.layer = scene.layer('layer', {
      handleEvent: false
    });
    this.timer = new Timer(this.config.duration, this.onUpdate.bind(this));
    this.initMaxValues();
  }
  private initMaxValues() {
    let values: number[] = this.config.data.columnNames.map((_, idx) => {
      const values = this.config.data.data.map(item => item.values[idx]);
      return Math.max(...values);
    })
    if (this.config.scaleType === 'fixed') {
      const max = Math.max(...values);
      values = [...new Array(this.config.data.columnNames.length)].fill(max);
    }
    this.maxValues = values;
  }
  // 渲染背景
  private async renderBackground() {
    const { image, color } = this.config.background;
    const { width, height } = this.config;
    if (color) {
      const rect = new Rect({
        fillColor: color,
        width, height
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
        width, height
      })
      this.layer.appendChild(sprite);
    }
  }
  private async renderTitle(config: TitleConfig): Promise<number> {
    if (!config.text) return 0;
    const label = new Label({
      text: config.text,
      font: `${config.fontSize}px ${config.fontFamily}`,
      lineHeight: config.lineHeight,
      fillColor: config.color,
      x: config.x,
      y: config.y,
      padding: config.padding
    })
    this.layer.appendChild(label);
    await label.textImageReady;
    const [width, height] = label.clientSize;
    if (config.align === 'center') {
      label.attr({ x: config.x + config.width / 2 - width / 2 })
    } else if (config.align === 'right') {
      label.attr({ x: config.width - width });
    }
    return height;
  }
  private renderAxis(x: number, y: number, width: number, height: number) {
    this.axis = new Axis({
      x: x + this.config.barLabel.width + this.config.justifySpacing,
      y,
      width: width - this.config.barLabel.width - this.config.justifySpacing * 2 - this.config.barValue.width,
      height,
      valueSplit: this.config.valueSplit,
      ...this.config.axis
    });
    this.axis.appendTo(this.layer);
  }
  private renderBars(x: number, y: number, width: number, height: number) {
    this.bars = new Bars({
      ...this.config,
      x,
      y: y + this.config.axis.tipHeight,
      width,
      height: height - this.config.axis.tipHeight,
    });
    return this.bars.appendTo(this.layer);
  }
  private renderColumnTip(x: number, y: number, width: number, height: number) {
    this.columnTip = new ColumnTip({
      x,
      y,
      width,
      height,
      barTotal: this.config.barTotal,
      barColumn: this.config.barColumn,
      valueSplit: this.config.valueSplit
    });
    return this.columnTip.appendTo(this.layer);
  }
  async render() {
    this.captureStream();
    await this.renderBackground();
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

    // 开始动画
    const length = this.config.data.columnNames.length;
    while (this.index < length) {
      this.beforeAnimate();
      await this.timer.animate();
      this.afterAnimate();
      this.index++;
    }
    // stop recorder
    if (this.recorder) {
      this.recorder.stop();
    }
  }
  /**
   * capture canvas stream
   */
  private captureStream() {
    if (!this.config.captureStream) return;
    const deferred: Deferred = {};
    deferred.promise = new Promise((resolve, reject) => {
      deferred.resolve = resolve;
      deferred.reject = reject;
    })
    this.deferred = deferred;
    const stream = (<CanvasElement>this.layer.canvas).captureStream();
    const recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
    const data: any[] = [];
    recorder.ondataavailable = function (event: MediaRecorderEvent) {
      if (event.data && event.data.size) {
        data.push(event.data);
      }
    };
    recorder.onstop = () => {
      const url = URL.createObjectURL(new Blob(data, { type: "video/webm" }));
      this.deferred.resolve(url);
    };
    recorder.start();
    this.recorder = recorder;
  }
  getStreamURL(): Promise<Blob> {
    if (!this.config.captureStream) {
      return Promise.reject(new Error('need enable captureStream options before'));
    }
    return this.deferred.promise;
  }
  private beforeAnimate() {
    sortValues(this.config.data.data, this.index, this.config.sortType);
    this.values = this.config.data.data.map(item => item.values[this.index]);
    this.bars.beforeAnimate(this.values, this.index);
    this.columnTip.beforeAnimate(this.config.data.columnNames[this.index]);
    this.axis.beforeAnimate(this.maxValues[this.index], this.config.scaleType);
  }
  private afterAnimate() {
    this.bars.afterAnimate(this.values, this.index, this.maxValues[this.index]);
    this.axis.afterAnimate(this.maxValues[this.index], this.config.scaleType);
  }
  private onUpdate(percent: number) {
    this.bars.update(this.values, this.index, percent, this.maxValues[this.index]);
    const totals = this.config.data.totalValues;
    this.columnTip.update(this.index === 0 ? 0 : totals[this.index - 1], totals[this.index], percent);
    this.axis.update(this.index === 0 ? 0 : this.maxValues[this.index - 1], this.maxValues[this.index], percent);
  }
}