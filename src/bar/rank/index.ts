import { BarTrend } from '../common/trend';
import { BarRankConfig } from './types';
import { deepmerge } from '../../common/util';
import { barRankConfig } from './config';
import { Bars } from './bars';
import { Position } from '../../common/types';

export class BarRank extends BarTrend {
  config: BarRankConfig;
  bars: Bars;
  index: number = 0; // 当前所在的数据 index
  maxValue: number;
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
    this.initMaxValue();
  }
  private initMaxValue() {
    this.maxValue = Math.max(...this.config.data.map(item => item.value));
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
    await this.renderBars({
      x: 0,
      y: 0,
      width: this.config.width,
      height: this.config.height,
    });
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
    }
    this.emit('end');
  }
  protected onUpdate(percent: number) {
    this.bars.onUpdate(this, percent);
  }
  beforeAnimate() {
    this.bars.beforeAnimate(this);
  }
  afterAnimate() {
    this.bars.afterAnimate(this);
  }
}