import { Bar } from './bar';
import { Group, Layer, Label } from 'spritejs';
import { BarsConfig, BarDataItem } from './config';
import deepmerge from 'ts-deepmerge';
import TWEEN from '@tweenjs/tween.js';


const defaultConfig: BarsConfig = {
  width: 300,
  height: 200,
  showNum: 10,
  alignSpacing: 5,
  justifySpacing: 5,
  duration: 2000,
  x: 0,
  y: 0,
  colors: '#1D6996|#EDAD08|#73AF48|#94346E|#38A6A5|#E17C05|#5F4690|#0F8554|#6F4070|#CC503E|#994E95|#666666'.split('|'),
  scaleType: 'dynamic',
  barLabel: {
    width: 100
  },
  barValue: {
    width: 100
  }
}
export class BarManage {
  bars: Bar[];
  group: Group;
  config: BarsConfig;
  currentIndex: number = 0;
  rectMaxWidth: number; // 矩形最大宽度
  barHeight: number; // 单个 bar 的高度
  delta: number;
  maxValue: number; // 数值的最大值
  constructor(config: BarsConfig) {
    this.config = deepmerge({}, defaultConfig, config);
    this.config.showNum = Math.min(this.config.showNum, this.config.data.data.length);
    this.group = new Group({
      x: this.config.x,
      y: this.config.y,
      width: this.config.width,
      height: this.config.height,
      bgcolor: '#ccc'
    });
    const { width, barLabel, barValue, justifySpacing, height, alignSpacing, showNum } = this.config;
    this.rectMaxWidth = width - barLabel.width - barValue.width - 2 * justifySpacing;
    this.barHeight = Math.floor((height - alignSpacing * (showNum - 1)) / showNum);
    this.delta = Math.floor((height - this.barHeight * showNum - (alignSpacing * (showNum - 1))) / 2);
    // 按第一个数据从大到小排序
    this.config.data.data.sort((a, b) => a.values[0] < b.values[0] ? 1 : -1);
    this.initMaxValue();
    this.initBars();
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
    }).start();
    tween.onComplete(() => {
      this.bars.forEach((bar, index) => {
        bar.config.index = prevData[index].newIndex;
        bar.attr({
          opacity: bar.config.index >= this.config.showNum ? 0 : 1
        })
      })
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
        ...this.config.barValue
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
        bar.labelPromise.then(() => {
          bar.attr({
            opacity: 0
          })
        })
      }
      return bar;
    })
  }
  private getBarY(index: number) {
    return (this.barHeight + this.config.alignSpacing) * Math.min(index, this.config.showNum - 1) + this.delta
  }
}