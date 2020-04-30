import { BaseAxis } from './base';
import { AxisTick } from '../types';

export class DynamicAxis extends BaseAxis {
  private maxValue: number = 0;
  private step: number = 0;

  private getFormatValue(value: number) {
    const str = value.toString();
    if (str.length <= 2) return value;
    return parseInt(str.substr(0, 2)) * Math.pow(10, str.length - 2);
  }

  private getSteps(value: number) {
    const item = Math.floor(value / this.config.maxTick).toString();
    let itemValue = item.length === 1 ? parseInt(item, 10) : parseInt(item.substr(0, 1), 10) * Math.pow(10, item.length - 1);
    itemValue = Math.max(1, itemValue);
    return [...new Array(this.config.maxTick)].map((_, index) => (index + 1) * itemValue);
  }
  // 更新 tick 的 位置
  private updateTicksPos(percent: number) {
    const isRow = this.config.type === 'row';
    const size = isRow ? this.config.height : this.config.width;
    const prop = isRow ? 'y' : 'x';
    this.ticks.forEach(tick => {
      const val = tick.value / this.maxValue * size;
      tick.group.attr({ [prop]: val });
      if (tick.remove) {
        tick.group.attr({ opacity: Math.max(0, 1 - percent * 3) });
      } else if (tick.value < this.maxValue) {
        tick.group.attr({ opacity: 1 });
      }
    })
  }
  protected addTicks(ticks: AxisTick[]) {
    super.addTicks(ticks);
    const isRow = this.config.type === 'row';
    const size = isRow ? this.config.height : this.config.width;
    const prop = isRow ? 'y' : 'x';
    this.ticks.forEach(tick => {
      const pos = Math.floor(tick.value / (this.maxValue || 1) * size);
      tick.group.attr({ [prop]: pos });
      if (tick.value > this.maxValue) {
        tick.group.attr({ opacity: 0 });
      }
    })
    this.ticks.sort((a, b) => {
      return a.value > b.value ? 1 : -1;
    })
  }
  public beforeAnimate(value: number, scaleType: string) {
    if (!this.maxValue) {
      this.maxValue = value;
      const steps = this.getSteps(value);
      this.step = steps[0];
      const ticks = [0].concat(steps).map(item => {
        return { value: item, label: this.config.label.formatter(item, 'axis') };
      });
      return this.addTicks(ticks);
    }
    if (scaleType === 'fixed') return;
    const max = this.ticks[this.ticks.length - 1].value;
    if (max + this.step < value) {
      let num = 0;
      let maxValue = 0;
      const newSteps = this.getSteps(value);
      if (max < newSteps[0]) {
        this.ticks.forEach((tick, index) => {
          if (!index) return;
          tick.remove = true;
        })
        this.step = newSteps[0];
        this.addTicks(newSteps.map(item => {
          return { value: item, label: this.config.label.formatter(item, 'axis') };
        }));
      } else {
        this.ticks.forEach((tick, index) => {
          if (index % 2 === 1) {
            tick.remove = true;
            num++;
          } else {
            maxValue = tick.value;
          }
        })
        this.step *= 2;
        if (num) {
          const values = [];
          while (num) {
            values.push(this.getFormatValue(maxValue + this.step));
            num--;
            maxValue += this.step;
          }
          this.addTicks(values.map(item => {
            return { value: item, label: this.config.label.formatter(item, 'axis') }
          }));
        }
      }
    }
  }
  public update(oldMaxValue: number, maxValue: number, percent: number) {
    if (oldMaxValue === maxValue) return;
    const v = Math.floor(oldMaxValue + (maxValue - oldMaxValue) * percent);
    if (!v) return;
    this.maxValue = v;
    this.updateTicksPos(percent);
  }
  public afterAnimate() {
    this.ticks = this.ticks.filter(tick => {
      if (!tick.remove) return true;
      this.group.removeChild(tick.group);
    })
  }
}