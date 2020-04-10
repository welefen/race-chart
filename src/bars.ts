import { Group, Layer } from 'spritejs';

import { Bar } from './bar';
import { BarsConfig, BarDataItem, AnimateData } from './type';

export class Bars {
  private bars: Bar[] = [];
  private group: Group;
  private config: BarsConfig;
  private rectMaxWidth: number; // 矩形最大宽度
  private barHeight: number; // 单个 bar 的高度
  private animateData: AnimateData[];
  constructor(config: BarsConfig) {
    this.config = config;
    this.group = new Group({
      x: this.config.x,
      y: this.config.y,
      width: this.config.width,
      height: this.config.height,
      // bgcolor: '#efefef'
    });
    const { width, barLabel, barValue, justifySpacing, height, alignSpacing, showNum } = this.config;
    this.rectMaxWidth = width - barLabel.width - barValue.width - 2 * justifySpacing;
    this.barHeight = (height - alignSpacing * (showNum - 1)) / showNum;
  }
  appendTo(layer: Layer): Promise<void> {
    layer.appendChild(this.group);
    return this.initBars();
  }
  beforeAnimate(values: number[], index: number): void {
    this.animateData = this.bars.map(bar => {
      const data = {
        value: bar.config.value.value,
        width: bar.config.rect.width,
        index: bar.index,
        newIndex: values.indexOf(bar.values[index]),
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
  update(values: number[], index: number, percent: number, maxValue: number): void {
    const showNum = this.config.showNum;
    this.bars.forEach((bar, idx) => {
      const item = this.animateData[idx];
      const value = bar.values[index];
      const width = Math.floor(value / maxValue * this.rectMaxWidth);
      const calValue = item.value + (value - item.value) * percent;
      const calWidth = item.width + (width - item.width) * percent;
      bar.rectWidth = calWidth;
      bar.valueText = Math.floor(calValue);
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
  afterAnimate(values: number[], index: number, maxValue: number): void {
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
      valueSplit: this.config.valueSplit
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