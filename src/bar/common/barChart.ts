import { BarChartConfig } from './types';
import { Axis } from './axis';
import { Chart } from '../../common/chart';

export class BarChart extends Chart {
  maxValues: number[];
  index: number = 0;
  config: BarChartConfig;
  axis: Axis;
  protected renderAxis(x: number, y: number, width: number, height: number) {
    const { label, justifySpacing, value } = this.config.bar;
    this.axis = new Axis({
      x: x + label.width + justifySpacing,
      y,
      width: width - label.width - justifySpacing * 2 - value.width,
      height,
      formatter: this.config.formatter,
      ...this.config.axis,
    });
    this.axis.appendTo(this.layer);
  }
}