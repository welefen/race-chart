import { Bar } from './bar';
import { Group } from 'spritejs';
import { BarManageConfig } from './config';
import deepmerge from 'ts-deepmerge';

const defaultConfig: BarManageConfig = {
  width: 300,
  height: 200,
  showNum: 10,
  alignSpacing: 5,
  justifySpacing: 5,
  x: 0,
  y: 0,
  colors: '#1D6996|#EDAD08|#73AF48|#94346E|#38A6A5|#E17C05|#5F4690|#0F8554|#6F4070|#CC503E|#994E95|#666666'.split('|'),
  scaleType: 'fixed',
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
  maxValue: number; // 数值的最大值
  constructor(config: BarManageConfig) {
    this.config = deepmerge({}, defaultConfig, config);
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
    this.updateBarRectWidth();
  }
  initMaxValue() {
    if (this.config.scaleType === 'dynamic') return;
    const values: number[] = [];
    this.config.data.data.forEach(item => {
      values.push(...item.values);
    });
    this.maxValue = Math.max(...values);
  }
  async updateBarRectWidth() {
    if(this.currentIndex >= this.config.data.columnNames.length) return;
    let maxValue = this.maxValue;
    if(this.config.scaleType === 'dynamic') {
      maxValue = Math.max(...this.bars.map(bar => bar.config.values[this.currentIndex]));
    }
    const promises = this.bars.map(bar => {
      const value = bar.config.values[this.currentIndex]
      const width = Math.floor(value / maxValue * this.rectMaxWidth);
      return bar.update(width, value);
    })
    await Promise.all(promises);
    this.currentIndex++;
    this.updateBarRectWidth();
  }
  initBars() {
    const num = Math.min(this.config.data.data.length, this.config.showNum)
    const height = Math.floor((this.config.height - this.config.alignSpacing * (num - 1)) / num);
    const delta = Math.floor((this.config.height - height * num - (this.config.alignSpacing * (num - 1))) / 2);
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
        values: item.values
      })
      bar.group.attr({
        x: 0,
        y: (height + this.config.alignSpacing) * Math.min(index, num - 1) + delta
      })
      // 多余的隐藏
      if (index >= num) {
        bar.group.attr({
          opacity: 0
        })
      }
      this.group.append(bar.group);
      return bar;
    })
  }
}