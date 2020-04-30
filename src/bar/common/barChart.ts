import { BarChartConfig } from './types';
import { DynamicAxis } from '../../common/axis/dynamic';
import { Chart } from '../../common/chart';

export class BarChart extends Chart {
  maxValues: number[];
  index: number = 0;
  config: BarChartConfig;
  axis: DynamicAxis;
  protected renderAxis(x: number, y: number, width: number, height: number) {
    const { label, justifySpacing, value } = this.config.bar;
    this.axis = new DynamicAxis({
      x: x + label.width + justifySpacing,
      y,
      width: width - label.width - justifySpacing * 2 - value.width,
      height,
      ...this.config.axis,
    });
    this.axis.appendTo(this.layer);
  }
}