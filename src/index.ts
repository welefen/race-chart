import { Scene, Layer, Rect, Sprite, } from "spritejs";
import deepmerge from 'ts-deepmerge';

import { Bars } from './bars';
import { parseData, sortValues, parseCombineValue, createLabel } from './util';
import { Timer } from './timer';
import { BarRaceConfig, TitleConfig } from './type';
import { defaultBarRace } from './config';
import { Axis } from './axis';
import { ColumnTip } from './columnTip';
import { Watermark } from './watermark';

export class BarRace {
  private scene: Scene;
  private timer: Timer;
  private bars: Bars;
  private axis: Axis;
  private columnTip: ColumnTip;
  layer: Layer;
  config: BarRaceConfig;
  index: number = 0; // 当前所在的数据 index
  values: number[] = []; //当前 index 所在的 values
  maxValues: number[]; // 最大的 values 列表
  constructor(config: BarRaceConfig) {
    this.config = deepmerge({}, defaultBarRace, config);
    this.config.padding = parseCombineValue(this.config.padding);
    this.config.data = parseData(this.config.data, this.config.showNum);
    // 按第一个数据从大到小排序
    sortValues(this.config.data.data, 0, this.config.sortType);
    // 可能数据长度不足 showNum 的大小
    this.config.showNum = Math.min(this.config.showNum, this.config.data.data.length);
    const scene = new Scene({
      container: this.config.container,
      width: this.config.width,
      height: this.config.height,
      displayRatio: this.config.displayRatio,
    })
    this.scene = scene;
    this.layer = scene.layer('layer', {
      handleEvent: false
    });
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
    const { barLabel, justifySpacing, valueSplit, barValue, axis } = this.config;
    this.axis = new Axis({
      x: x + barLabel.width + justifySpacing,
      y,
      width: width - barLabel.width - justifySpacing * 2 - barValue.width,
      height,
      valueSplit: valueSplit,
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
    const { barTotal, barColumn, barValue, valueSplit } = this.config;
    this.columnTip = new ColumnTip({
      x,
      y,
      width: width - barValue.width / 2,
      height,
      barTotal,
      barColumn,
      valueSplit
    });
    return this.columnTip.appendTo(this.layer);
  }
  renderWatermark(): Promise<Watermark> {
    const watermark = new Watermark({
      x: 0,
      y: 0,
      width: this.config.width,
      height: this.config.height,
      ...this.config.watermark
    })
    return watermark.appendTo(this.layer).then(_ => watermark);
  }
  async render() {
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

    // 开始动画
    const length = this.config.data.columnNames.length;
    let { duration } = this.config;
    while (this.index < length) {
      this.beforeAnimate();
      if (this.index) {
        const dur = typeof duration === 'function' ? duration(this.index, length) : duration;
        await this.timer.animate(dur);
      }
      this.afterAnimate();
      this.index++;
    }
    const { lastStayTime } = this.config;
    const timer = new Timer(lastStayTime, _ => {
      this.columnTip.totalOpacity = Math.random() > 0.5 ? 0.8 : 1;
    })
    await timer.animate();
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