import { BarTrend } from '../common/trend';
import { BarRankConfig } from './types';
import { deepmerge, timeout } from '../../common/util';
import { barRankConfig } from './config';
import { Bars } from './bars';
import { Position } from '../../common/types';

export class BarRank extends BarTrend {
  private bars: Bars;
  config: BarRankConfig;
  index: number = 0; // 当前所在的数据 index
  constructor(config: BarRankConfig) {
    super(config);
  }
  setConfig(config: BarRankConfig) {
    config = deepmerge({}, barRankConfig, this.config, config);
    super.setConfig(config);
    this.config.data.sort((a, b) => {
      return a.value > b.value ? 1 : -1;
    })
    // 可能数据长度不足 showNum 的大小
    this.config.showNum = Math.min(this.config.showNum, this.config.data.length);
    this.initMaxValues();
  }
  private initMaxValues() {
    let values = this.config.data.map(item => item.value);
    values = values.map((val, index) => {
      if (index < 3) {
        return Math.max(val, values[3]);
      }
      if (index > this.config.showNum) {
        return Math.max(val, values[Math.max(3, index % this.config.showNum)]);
      }
      return val;
    })
    this.maxValues = values;
  }
  private renderBars(pos: Position) {
    this.bars = new Bars({
      ...this.config,
      ...pos
    });
    return this.bars.appendTo(this.layer);
  }
  async render() {
    await super.render();
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
    const { tipHeight } = this.config.axis;
    await this.renderBars({ x, y: y + tipHeight, width, height: height - tipHeight });
  }
  async start() {
    await this.render();
    const length = this.config.data.length;
    let { duration } = this.config;
    while (this.index < length) {
      this.emit('change', this.index);
      await this.beforeAnimate();
      const dur = typeof duration === 'function' ? duration(this.index, length) : duration;
      await this.timer.start(dur);
      await this.afterAnimate();
      this.index++;
      await timeout(this.config.delay);
    }
    this.emit('end');
  }
  protected onUpdate(percent: number) {
    this.bars.onUpdate(this, percent);
    this.axis.update(this, percent);
  }
  beforeAnimate() {
    this.bars.beforeAnimate(this);
    this.axis.beforeAnimate(this);
  }
  afterAnimate() {
    this.bars.afterAnimate(this);
    this.axis.afterAnimate(this);
  }
}