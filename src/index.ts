import { Scene, Layer } from "spritejs";
import { Bars } from './bars';
import { parseData, sortValues } from './util';
import { Timer } from './timer';
import { BarRaceConfig } from './type';
import deepmerge from 'ts-deepmerge';
import { defaultBarRace } from './config';
import { Axis } from './axis';
import { ColumnTip } from './columnTip';

export class BarRace {
  layer: Layer;
  timer: Timer;
  bars: Bars;
  axis: Axis;
  columnTip: ColumnTip;
  config: BarRaceConfig;
  index: number = 0; // 当前所在的数据 index
  values: number[] = [];
  maxValues: number[];
  constructor(config: BarRaceConfig) {
    this.config = deepmerge({}, defaultBarRace, config);
    this.config.data = parseData(this.config.data, this.config.showNum);
    // 按第一个数据从大到小排序
    sortValues(this.config.data.data, 0, this.config.sortType);
    // 可能数据长度不足 showNum 的大小
    this.config.showNum = Math.min(this.config.showNum, this.config.data.data.length);
    const scene = new Scene({
      container: document.querySelector(this.config.selector),
      width: this.config.width,
      height: this.config.height,
      displayRatio: this.config.displayRatio
    })
    this.layer = scene.layer();
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
  async render() {
    const titleHeight = 50;
    this.axis = new Axis({
      x: this.config.barLabel.width + this.config.justifySpacing,
      y: titleHeight,
      width: this.config.width - this.config.barLabel.width - this.config.justifySpacing * 2 - this.config.barValue.width,
      height: this.config.height - titleHeight,
      valueSplit: this.config.valueSplit,
      ...this.config.axis
    });
    this.axis.appendTo(this.layer);

    this.bars = new Bars({
      ...this.config,
      x: 0,
      y: titleHeight + 30,
      width: this.config.width,
      height: this.config.height - 80,
    });
    this.bars.appendTo(this.layer);

    this.columnTip = new ColumnTip({
      x: 0,
      y: titleHeight + 30,
      width: this.config.width,
      height: this.config.height - 80,
      barTotal: this.config.barTotal,
      barColumn: this.config.barColumn,
      valueSplit: this.config.valueSplit
    });
    this.columnTip.appendTo(this.layer);
    await this.columnTip.promise;

    // 开始动画
    const length = this.config.data.columnNames.length;
    while (this.index < length) {
      this.beforeAnimate();
      await this.timer.animate();
      this.afterAnimate();
      this.index++;
    }
  }
  private beforeAnimate() {
    sortValues(this.config.data.data, this.index, this.config.sortType);
    this.values = this.config.data.data.map(item => item.values[this.index]);
    this.bars.beforeAnimate(this.values, this.index);
    this.columnTip.beforeAnimate(this.config.data.columnNames[this.index]);
    this.axis.beforeAnimate(this.maxValues[this.index]);
  }
  private afterAnimate() {
    this.bars.afterAnimate(this.values, this.index);
    this.axis.afterAnimate(this.maxValues[this.index]);
  }
  private onUpdate(percent: number) {
    this.bars.update(this.values, this.index, percent, this.maxValues[this.index]);
    const totals = this.config.data.totalValues;
    this.columnTip.update(this.index === 0 ? 0 : totals[this.index - 1], totals[this.index], percent);
    this.axis.update(this.index === 0 ? 0 : this.maxValues[this.index - 1], this.maxValues[this.index], percent);
  }
}