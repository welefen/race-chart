import { BaseAxis } from './base';

export class FixedAxis extends BaseAxis {
  private columns: string[];
  private itemWidth: number;
  private maxTick: number;
  initTicks(columns: string[]) {
    this.columns = columns;
    const { width, maxTick } = this.config;
    this.itemWidth = width / maxTick;
    this.maxTick = maxTick;
    const arr = [...new Array(maxTick + 1)].map((_, index) => {
      return { value: index, label: columns[index] };
    })
    this.addTicks(arr);
    this.ticks.forEach((tick, index) => {
      tick.group.attr({
        x: this.itemWidth * index
      })
    })
  }
  beforeAnimate(index: number) {

  }
  onUpdate(index: number, percent: number) {
    if (index <= this.maxTick) return;
    const first = this.ticks[0];
    first.group.children[0].attr({
      opacity: 1 - percent
    })
    this.ticks.forEach((tick, idx) => {
      if (!idx) return;
      tick.group.attr({
        x: this.itemWidth * idx - percent * this.itemWidth
      })
    })
  }
  afterAnimate(index: number) {
    if (index <= this.maxTick) return;
    this.group.removeChild(this.ticks[0].group);
    this.ticks = this.ticks.slice(1);
    this.addTicks([{
      value: index,
      label: this.columns[index],
    }]);
    this.ticks.forEach((tick, idx) => {
      tick.group.attr({
        x: this.itemWidth * idx
      })
    })
  }
}