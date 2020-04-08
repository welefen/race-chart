import { Bar } from './bar';
import { Group, Layer } from 'spritejs';
import { BarsConfig, BarDataItem, defaultBarsConfig } from './config';
import deepmerge from 'ts-deepmerge';
import TWEEN from '@tweenjs/tween.js';
import { ColumnTip } from './columnTip';


export class BarManage {
  bars: Bar[];
  group: Group;
  config: BarsConfig;
  currentIndex: number = 0;
  rectMaxWidth: number; // 矩形最大宽度
  barHeight: number; // 单个 bar 的高度
  delta: number;
  maxValue: number; // 数值的最大值
  columnTip: ColumnTip;
  promises: Promise<any>[] = [];
  constructor(config: BarsConfig) {
    this.config = deepmerge({}, defaultBarsConfig, config);
    this.config.showNum = Math.min(this.config.showNum, this.config.data.data.length);
    this.group = new Group({
      x: this.config.x,
      y: this.config.y,
      width: this.config.width,
      height: this.config.height,
      bgcolor: '#efefef'
    });
    const { width, barLabel, barValue, justifySpacing, height, alignSpacing, showNum } = this.config;
    this.rectMaxWidth = width - barLabel.width - barValue.width - 2 * justifySpacing;
    this.barHeight = Math.floor((height - alignSpacing * (showNum - 1)) / showNum);
    this.delta = Math.floor((height - this.barHeight * showNum - (alignSpacing * (showNum - 1))) / 2);
    // 按第一个数据从大到小排序
    this.config.data.data.sort((a, b) => a.values[0] < b.values[0] ? 1 : -1);
    this.initMaxValue();
    this.initBars();
    this.initColumnTip();
  }
  private initColumnTip() {
    const tip = new ColumnTip(this.config.width, this.config.height, this.config.barColumn, {
      split: this.config.valueSplit,
      ...this.config.barTotal
    });
    this.promises.push(tip.promise);
    this.columnTip = tip;
    tip.appendTo(this.group);
  }
  appendTo(layer: Layer) {
    layer.appendChild(this.group);
  }
  private initMaxValue() {
    if (this.config.scaleType === 'dynamic') return;
    const values: number[] = [];
    this.config.data.data.forEach(item => {
      values.push(...item.values);
    });
    this.maxValue = Math.max(...values);
  }
  private getBarsData(values: number[]) {
    return this.bars.map(bar => {
      const data = {
        value: bar.config.value.value,
        width: bar.config.rect.width,
        index: bar.config.index,
        newIndex: values.indexOf(bar.values[this.currentIndex]),
        pos: 0,
        newPos: 0
      }
      data.pos = this.getBarY(data.index);
      if (data.index !== data.newIndex) {
        data.newPos = this.getBarY(data.newIndex);
      }
      return data;
    })
  }
  private updateBars(prevData: Record<string, any>, maxValue: number, percent: number) {
    const showNum = this.config.showNum;
    this.bars.forEach((bar, index) => {
      const item = prevData[index];
      const value = bar.values[this.currentIndex];
      const width = Math.floor(value / maxValue * this.rectMaxWidth);
      const calValue = item.value + (value - item.value) * percent;
      const calWidth = item.width + (width - item.width) * percent;
      bar.rectWidth = calWidth;
      bar.valueText = Math.floor(calValue);
      if (item.newPos) {
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
  update() {
    if (this.currentIndex >= this.config.data.columnNames.length) return;
    this.columnTip.setColumnText(this.config.data.columnNames[this.currentIndex]);

    const values = this.bars.map(bar => bar.values[this.currentIndex]);
    values.sort((a, b) => a < b ? 1 : -1);
    const maxValue = this.config.scaleType === 'dynamic' ? values[0] : this.maxValue;
    const prevData = this.getBarsData(values);
    const timeData = { time: 0 };
    const tween = new TWEEN.Tween(timeData).to({
      time: this.config.duration
    }, this.config.duration).easing(TWEEN.Easing.Linear.None).onUpdate(() => {
      const percent = timeData.time / this.config.duration;
      this.updateBars(prevData, maxValue, percent);
      const total = Math.floor(this.columnTip.totalValue + (this.config.data.totalValues[this.currentIndex] - this.columnTip.totalValue) * percent)
      this.columnTip.setTotalText(total);
    }).start();
    tween.onComplete(() => {
      this.bars.forEach((bar, index) => {
        bar.valueText = bar.values[this.currentIndex];
        bar.config.index = prevData[index].newIndex;
        bar.attr({
          opacity: bar.config.index >= this.config.showNum ? 0 : 1
        })
      })
      this.columnTip.setTotalText(this.config.data.totalValues[this.currentIndex]);
      this.currentIndex++;
      this.update();
    })
  }
  private getBarInstance(item: BarDataItem, index: number) {
    return new Bar({
      x: 0,
      y: this.getBarY(index),
      width: this.config.width,
      height: this.barHeight,
      spacing: this.config.justifySpacing,
      label: {
        text: item.label,
        ...this.config.barLabel
      },
      rect: {
        width: 0,
        color: this.config.colors[index % this.config.colors.length],
      },
      value: {
        value: item.values[0],
        split: this.config.valueSplit || {},
        ...this.config.barValue,
      },
      values: item.values,
      index
    })
  }
  private initBars() {
    this.bars = this.config.data.data.map((item, index) => {
      const bar = this.getBarInstance(item, index);
      bar.appendTo(this.group);
      // 多余的隐藏
      if (index >= this.config.showNum) {
        bar.attr({
          opacity: 0
        })
      }
      return bar;
    })
  }
  private getBarY(index: number) {
    return (this.barHeight + this.config.alignSpacing) * Math.min(index, this.config.showNum - 1) + this.delta
  }
}