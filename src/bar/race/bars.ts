import { Group, Layer, Label } from 'spritejs';

import { Bar } from '../common/bar';
import { BarRace } from './index';
import { BarsConfig, BarDataItem, AnimateData } from './types';
import { BarConfig } from '../common/types';
import { createGroup, createLabel } from '../../common/util';
import deepmerge from 'deepmerge';

export class Bars {
  private bars: Bar[] = [];
  private group: Group;
  private config: BarsConfig;
  private rectMaxWidth: number; // 矩形最大宽度
  private barHeight: number; // 单个 bar 的高度
  private animateData: AnimateData[];
  private totalLabel: Label;
  private totalLabelHeight: number;
  private columnLabel: Label;
  constructor(config: BarsConfig) {
    this.config = config;
    this.group = createGroup(this.config);
    const { width, height, showNum } = this.config;
    const { label, value, justifySpacing, alignSpacing } = this.config.bar;
    this.rectMaxWidth = width - label.width - value.width - 2 * justifySpacing;
    this.barHeight = (height - alignSpacing * (showNum - 1)) / showNum;
  }
  async appendTo(layer: Layer): Promise<void> {
    layer.appendChild(this.group);
    await this.initBars();
    await this.initTotal();
    return this.initColumn();
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
    this.setColumnText(barRace.config.data.columnNames[barRace.index]);
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
    // 更新总数
    if (!this.config.bar.total.disabled) {
      const totals = barRace.config.data.totalValues;
      const prevTotal = barRace.index === 0 ? 0 : totals[barRace.index - 1];
      const total = totals[barRace.index];
      const value = Math.floor(prevTotal + (total - prevTotal) * percent);
      this.setTotalText(value);
    }
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
    const color = this.config.colors[index % this.config.colors.length];
    const data: BarConfig = {
      x: 0,
      y: this.getBarY(index),
      width: this.config.width,
      height: this.barHeight,
      label: {
        text: item.label
      },
      color,
      value: {
        value: item.values[0],
        formatter: this.config.formatter
      },
      logo: {
        image: item.image
      }
    }
    const config = deepmerge(this.config.bar, data);
    return new Bar(config, index, item.values)
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
  setTotalText(value: number) {
    const total = this.config.bar.total;
    if (total.disabled) return Promise.resolve();
    total.value = value;
    const text = this.config.formatter(value, 'total');
    this.totalLabel.attr({
      text: `${total.prefix}${text}`,
    })
  }
  private initTotal() {
    if (this.config.bar.total.disabled) return Promise.resolve();
    const barTotal = this.config.bar.total;
    const label = createLabel('', barTotal);
    label.attr({
      width: this.config.width
    })
    this.totalLabel = label;
    this.group.appendChild(label);
    this.setTotalText(barTotal.value || 0);
    return this.totalLabel.textImageReady.then(() => {
      const [_, height] = this.totalLabel.clientSize;
      this.totalLabelHeight = height;
      this.totalLabel.attr({
        y: this.config.height - height
      })
    })
  }
  setColumnText(text: string) {
    this.columnLabel.attr({ text });
  }
  private initColumn() {
    const { column } = this.config.bar;
    const label = createLabel('', column);
    label.attr({
      width: this.config.width
    })
    this.columnLabel = label;
    this.group.appendChild(label);
    this.setColumnText(column.text);
    return this.columnLabel.textImageReady.then(() => {
      const [_, height] = this.columnLabel.clientSize;
      this.columnLabel.attr({
        y: this.config.height - height - (this.totalLabelHeight || 0)
      })
    })
  }
  private getBarY(index: number) {
    return (this.barHeight + this.config.bar.alignSpacing) * Math.min(index, this.config.showNum - 1);
  }
}