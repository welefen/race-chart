import { Group, Layer } from 'spritejs';

import { Bar } from './bar';
import { BarsConfig, BarDataItem, AnimateData } from './type';
import { BarRace } from './index';
import { createGroup } from './util';

export class Bars {
  private bars: Bar[] = [];
  private group: Group;
  private config: BarsConfig;
  private rectMaxWidth: number; // 矩形最大宽度
  private barHeight: number; // 单个 bar 的高度
  private animateData: AnimateData[];
  constructor(config: BarsConfig) {
    this.config = config;
    this.group = createGroup(this.config);
    const { width, barLabel, barValue, justifySpacing, height, alignSpacing, showNum } = this.config;
    this.rectMaxWidth = width - barLabel.width - barValue.width - 2 * justifySpacing;
    this.barHeight = (height - alignSpacing * (showNum - 1)) / showNum;
  }
  appendTo(layer: Layer): Promise<void> {
    layer.appendChild(this.group);
    return this.initBars();
  }
  beforeAnimate(barRace: BarRace): void {
    const { values, index } = barRace;
    this.animateData = this.bars.map(bar => {
      const newIndex = values.indexOf(bar.values[index]);
      values[newIndex] = -1; // 处理可能值相同的情况
      const data = {
        value: bar.config.value.value,
        width: bar.config.rect.width,
        index: bar.index,
        newIndex,
        pos: 0,
        newPos: -1
      }
      data.pos = this.getBarY(data.index);
      if (data.index !== data.newIndex) {
        data.newPos = this.getBarY(data.newIndex);
      }
      return data;
    })
  }
  update(barRace: BarRace, percent: number): void {
    const index = barRace.index;
    const maxValue = barRace.maxValues[index];
    const showNum = this.config.showNum;
    this.bars.forEach((bar, idx) => {
      const item = this.animateData[idx];
      const value = bar.values[index];
      const width = Math.floor(value / maxValue * this.rectMaxWidth);
      //if bar is hidden, dont't change rect width & value, only update in after animate
      if (item.index < showNum || item.newIndex < showNum) {
        bar.rectWidth = item.width + (width - item.width) * percent;
        bar.valueText = item.value + (value - item.value) * percent;
      }
      if (item.newPos > -1) {
        bar.attr({
          y: item.pos + (item.newPos - item.pos) * Math.min(percent * 2, 1)
        })
        if (item.index < showNum && item.newIndex >= showNum) {
          bar.attr({
            opacity: Math.max(0, 1 - percent * 2)
          })
        } else if (item.index >= showNum && item.newIndex < showNum) {
          bar.attr({
            opacity: Math.min(1, percent * 2)
          })
        }
      }
    })
  }
  afterAnimate(barRace: BarRace): void {
    const { index } = barRace;
    const maxValue = barRace.maxValues[index];
    this.bars.forEach((bar, idx) => {
      bar.rectWidth = Math.floor(bar.values[index] / maxValue * this.rectMaxWidth);
      bar.valueText = bar.values[index];
      bar.index = this.animateData[idx].newIndex;
      bar.attr({
        opacity: bar.index >= this.config.showNum ? 0 : 1
      })
    })
  }
  private getBarInstance(item: BarDataItem, index: number): Bar {
    const { colors } = this.config;
    return new Bar({
      x: 0,
      y: this.getBarY(index),
      width: this.config.width,
      height: this.barHeight,
      justifySpacing: this.config.justifySpacing,
      label: {
        text: item.label,
        ...this.config.barLabel
      },
      rect: {
        ...this.config.barRect,
        width: 0,
        color: colors[index % colors.length],
      },
      value: {
        value: item.values[0],
        ...this.config.barValue,
      },
      logo: {
        src: item.image,
        ...this.config.barLogo
      },
      formatter: this.config.formatter
    }, index, item.values)
  }
  private initBars(): Promise<any> {
    const promises = this.config.data.data.map((item, index) => {
      const bar = this.getBarInstance(item, index);
      this.bars.push(bar);
      // 多余的隐藏
      if (index >= this.config.showNum) {
        bar.attr({ opacity: 0 })
      }
      return bar.appendTo(this.group);
    })
    return Promise.all(promises);
  }
  private getBarY(index: number) {
    return (this.barHeight + this.config.alignSpacing) * Math.min(index, this.config.showNum - 1);
  }
}