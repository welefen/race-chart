import { Bar } from './bar';
import { Group } from 'spritejs';
import { BarManageConfig } from './config';
import deepmerge from 'ts-deepmerge';
import TWEEN from '@tweenjs/tween.js';


const defaultConfig: BarManageConfig = {
  width: 300,
  height: 200,
  showNum: 10,
  alignSpacing: 5,
  justifySpacing: 5,
  duration: 1000,
  x: 0,
  y: 0,
  colors: '#1D6996|#EDAD08|#73AF48|#94346E|#38A6A5|#E17C05|#5F4690|#0F8554|#6F4070|#CC503E|#994E95|#666666|#994E95|#994E95'.split('|'),
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
  config: BarManageConfig;
  currentIndex: number = 0;
  rectMaxWidth: number;
  barHeight: number;
  delta: number;
  maxValue: number; // 数值的最大值
  constructor(config: BarManageConfig) {
    this.config = deepmerge({}, defaultConfig, config);
    this.config.showNum = Math.min(this.config.showNum, this.config.data.data.length);
    this.group = new Group({
      x: this.config.x,
      y: this.config.y,
      width: this.config.width,
      height: this.config.height,
      bgcolor: '#ccc'
    });
    this.rectMaxWidth = this.config.width - this.config.barLabel.width - this.config.barValue.width - 2 * this.config.justifySpacing;
    this.initBars();
    this.initMaxValue();
  }
  initMaxValue() {
    if (this.config.scaleType === 'dynamic') return;
    const values: number[] = [];
    this.config.data.data.forEach(item => {
      values.push(...item.values);
    });
    this.maxValue = Math.max(...values);
  }
  async update() {
    if (this.currentIndex >= this.config.data.columnNames.length) return;
    const values = this.bars.map(bar => bar.config.values[this.currentIndex]);
    values.sort((a, b) => a < b ? 1 : -1);
    const maxValue = this.config.scaleType === 'dynamic' ? values[0] : this.maxValue;
    const prevData = this.bars.map(bar => {
      const data = {
        value: bar.config.value.value,
        width: bar.config.rect.width,
        index: bar.config.index,
        newIndex: values.indexOf(bar.config.values[this.currentIndex]),
        pos: bar.group.attributes.y,
        newPos: 0,
        opacity: bar.group.attributes.opacity
      }
      if (data.index !== data.newIndex) {
        data.newPos = this.getBarTop(data.newIndex);
      }
      return data;
    })
    const showNum = this.config.showNum;
    const timeData = { time: 0 }
    const tween = new TWEEN.Tween(timeData).to({
      time: this.config.duration
    }, this.config.duration).easing(TWEEN.Easing.Linear.None).onUpdate(() => {
      const percent = timeData.time / this.config.duration;
      this.bars.forEach((bar, index) => {
        const item = prevData[index];
        const value = bar.config.values[this.currentIndex];
        const width = Math.floor(value / maxValue * this.rectMaxWidth);
        const calValue = item.value + (value - item.value) * percent;
        const calWidth = item.width + (width - item.width) * percent;
        bar.rectWidth = calWidth;
        bar.valueText = Math.floor(calValue);
        if (item.newPos) {
          bar.group.attr({
            y: item.pos + (item.newPos - item.pos) * Math.min(percent * 2, 1)
          })
          if (item.index < showNum && item.newIndex >= showNum) {
            bar.group.attr({
              opacity: Math.max(0, 1 - percent * 2)
            })
          } else if (item.index >= showNum && item.newIndex < showNum) {
            bar.group.attr({
              opacity: Math.min(1, percent * 2)
            })
          }
        }
      })
    }).start();
    tween.onComplete(() => {
      this.bars.forEach((bar, index) => {
        bar.config.index = prevData[index].newIndex;
        bar.group.attr({
          opacity: bar.config.index >= this.config.showNum ? 0 : 1
        })
      })
      this.currentIndex++;
      this.update();
    })
  }
  initBars() {
    const num = this.config.showNum;
    const height = Math.floor((this.config.height - this.config.alignSpacing * (num - 1)) / num);
    this.barHeight = height;
    const delta = Math.floor((this.config.height - height * num - (this.config.alignSpacing * (num - 1))) / 2);
    this.delta = delta;
    this.config.data.data.sort((a, b) => a.values[0] < b.values[0] ? 1 : -1);
    this.bars = this.config.data.data.map((item, index) => {
      const bar = new Bar({
        width: this.config.width,
        height: height,
        spacing: this.config.justifySpacing,
        label: {
          text: item.label,
          ...this.config.barLabel
        },
        rect: {
          width: 0,
          color: this.config.colors[index],
        },
        value: {
          value: item.values[0],
          ...this.config.barValue
        },
        values: item.values,
        index
      })
      bar.group.attr({
        x: 0,
        y: this.getBarTop(index)
      })
      this.group.append(bar.group);
      // 多余的隐藏
      if (index >= num) {
        bar.labelPromise.then(() => {
          bar.group.attr({
            opacity: 0
          })
        })
      }
      return bar;
    })
  }
  getBarTop(index: number) {
    return (this.barHeight + this.config.alignSpacing) * Math.min(index, this.config.showNum - 1) + this.delta
  }
}