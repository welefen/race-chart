import { Bar } from './bar';
import { Group } from 'spritejs';
import { BarManageConfig } from './config';

const data = [{
  name: 'China',
  value: 11000
}, {
  name: 'America',
  value: 2000
}, {
  name: 'India',
  value: 10
}]

export class BarManage {
  bars: Bar[];
  group: Group;
  config: BarManageConfig;
  constructor(config: BarManageConfig) {
    this.config = { width: 300, height: 200, showNum: 10, spacing: 10, ...config };
    this.group = new Group({
      x: 0,
      y: 0,
      width: this.config.width,
      height: this.config.height
    });
    this.initBars();
  }
  initBars() {
    data.forEach((item, index) => {
      const bar = new Bar({
        width: this.config.width,
        height: 30,
        name: {
          text: item.name
        },
        value: {
          text: item.value + ''
        },
      })
      bar.group.attr({
        x: 0,
        y: 35 * index
      })
      this.group.append(bar.group);
    })
  }
}