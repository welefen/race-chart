import { BarsConfig, AnimateData } from './types';
import { createGroup } from '../../common/util';
import { Group, Layer } from 'spritejs';
import { Bar } from '../common/bar';
import { BarRank } from './index';
import deepmerge from 'deepmerge';

export class Bars {
  private animateData: AnimateData[] = [];
  private rectMaxWidth: number; // 矩形最大宽度
  private barHeight: number; // 单个 bar 的高度
  config: BarsConfig;
  group: Group;
  bars: Bar[] = [];
  constructor(config: BarsConfig) {
    this.config = config;
    this.group = createGroup(this.config);
    const { width, height, showNum } = this.config;
    const { label, value, justifySpacing, alignSpacing } = this.config.bar;
    this.rectMaxWidth = width - label.width - value.width - 2 * justifySpacing;
    this.barHeight = (height - alignSpacing * (showNum - 1)) / showNum;
  }
  async beforeAnimate(barRank: BarRank) {
    const { data, colors } = barRank.config;
    const item = data[barRank.index];
    const color = colors[barRank.index % colors.length];
    const config = deepmerge(this.config.bar, {
      width: this.config.width,
      height: this.barHeight,
      label: {
        text: item.label
      },
      color,
      value: {
        value: item.value,
        formatter: this.config.formatter
      },
      logo: {
        image: item.image
      }
    })
    const bar = new Bar(config, 0);
    await bar.appendTo(this.group);
    bar.valueText = item.value;
    bar.rectWidth = this.rectMaxWidth * item.value / barRank.maxValue;
    this.bars.push(bar);
  }
  onUpdate(barRank: BarRank, percent: number) {
    this.bars.forEach(bar => {
      const nowY = this.getBarY(bar.index);
      const newY = this.getBarY(bar.index + 1);
      bar.attr({
        y: nowY + (newY - nowY) * percent
      })
    })
  }
  afterAnimate(barRank: BarRank) {
    this.bars.forEach(bar => {
      bar.index++;
    })
  }
  appendTo(layer: Layer) {
    layer.appendChild(this.group);
  }
  private getBarY(index: number) {
    return (this.barHeight + this.config.bar.alignSpacing) * Math.min(index, this.config.showNum - 1);
  }
}