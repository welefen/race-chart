import { BaseAxis } from './base';

export class FixedAxis extends BaseAxis {
  columns: string[];
  initTicks(columns: string[]) {
    this.columns = columns;
    const { width, maxTick } = this.config;
    const itemWidth = width / maxTick;
    const arr = [...new Array(maxTick + 1)].map((_, index) => {
      return { value: index, label: columns[index] };
    })
    this.addTicks(arr);
    this.ticks.forEach((tick, index) => {
      tick.group.attr({
        x: itemWidth * index
      })
    })
  }
}