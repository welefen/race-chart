import { Bar } from './bar';
import { Group } from 'spritejs';
import { BarManageConfig } from './config';
import BarData from './data';
import { spitValueWidthComma } from './util';

const defaultConfig: BarManageConfig = {
  width: 300,
  height: 200,
  showNum: 10,
  spacing: 5,
  x: 0,
  y: 0
}
export class BarManage {
  bars: Bar[];
  group: Group;
  config: BarManageConfig;
  constructor(config: BarManageConfig) {
    this.config = { ...defaultConfig, ...config };
    this.group = new Group({
      x: this.config.x,
      y: this.config.y,
      width: this.config.width,
      height: this.config.height,
      bgcolor: '#ccc'
    });
    this.initBars();
  }
  initBars() {
    const num = Math.min(BarData.data.length, this.config.showNum)
    const height = Math.round((this.config.height - this.config.spacing * (num - 1)) / num)
    BarData.data.forEach((item, index) => {
      const bar = new Bar({
        width: this.config.width,
        height: height,
        label: {
          text: item.label
        },
        value: {
          text: spitValueWidthComma(item.values[0], 3)
        },
      })
      bar.group.attr({
        x: 0,
        y: (height + this.config.spacing) * index
      })
      this.group.append(bar.group);
    })
  }
}