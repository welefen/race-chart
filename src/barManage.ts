import { Bar } from './bar';
import { Group } from 'spritejs';
import { BarManageConfig } from './config';
import BarData from './data';
import { spitValueWidthComma } from './util';

const defaultConfig: BarManageConfig = {
  width: 300,
  height: 200,
  showNum: 10,
  alignSpacing: 5,
  justifySpacing: 5,
  x: 0,
  y: 0,
  colors: '#1D6996|#EDAD08|#73AF48|#94346E|#38A6A5|#E17C05|#5F4690|#0F8554|#6F4070|#CC503E|#994E95|#666666'.split('|')
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
    const height = Math.floor((this.config.height - this.config.alignSpacing * (num - 1)) / num);
    const delta = Math.floor((this.config.height - height * num - (this.config.alignSpacing * (num - 1))) / 2);
    BarData.data.slice(0, num).forEach((item, index) => {
      const bar = new Bar({
        width: this.config.width,
        height: height,
        spacing: this.config.justifySpacing,
        label: {
          text: item.label
        },
        rect: {
          width: 200,
          color: this.config.colors[index]
        },
        value: {
          text: spitValueWidthComma(item.values[0], 3)
        },
      })
      bar.group.attr({
        x: 0,
        y: (height + this.config.alignSpacing) * index + delta
      })
      this.group.append(bar.group);
    })
  }
}