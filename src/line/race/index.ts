import { Chart } from '../../common/chart';
import { DynamicAxis } from '../../common/axis/dynamic';
import { FixedAxis } from '../../common/axis/fixed';
import { LineRaceConfig } from './types';
import { lineRaceConfig } from './config';
import { deepmerge } from '../../common/util';

export class LineRace extends Chart {
  protected yAxis: DynamicAxis;
  protected xAxis: DynamicAxis;
  config: LineRaceConfig;
  setConfig(config: LineRaceConfig) {
    config = deepmerge({}, lineRaceConfig, this.config || {}, config || {});
    super.setConfig(config);
  }

  protected renderYAxis(x: number, y: number, width: number, height: number) {
    this.yAxis = new DynamicAxis({
      type: 'row',
      x,
      y,
      width,
      height,
      ...this.config.yAxis,
    });
    this.yAxis.appendTo(this.layer);
  }
  protected renderXAxis(x: number, y: number, width: number, height: number) {
    this.xAxis = new DynamicAxis({
      type: 'column',
      x,
      y,
      width,
      height,
      ...this.config.xAxis,
    });
    this.xAxis.appendTo(this.layer);
  }
  async render() {
    await super.render();
    let [y, paddingRight, paddingBottom, x] = <number[]>this.config.padding;
    let width = this.config.width - x - paddingRight;
    let height = this.config.height - y - paddingBottom;
    const titleHeight = await this.renderTitle({
      ...this.config.title,
      x, y, width, height
    })
    y += titleHeight;
    height -= titleHeight;
    const subTitleHeight = await this.renderTitle({
      ...this.config.subTitle,
      x, y, width, height
    })
    y += subTitleHeight;
    height -= subTitleHeight;

    const yAxisLabelWidth = this.config.yAxis.label.width;
    const xAxisLabelHeight = this.config.xAxis.label.height;

    this.renderYAxis(x, y, width, height - xAxisLabelHeight);
    this.yAxis.beforeAnimate(1000000, '');

    this.renderXAxis(x + yAxisLabelWidth, y, width - yAxisLabelWidth, height);
    this.xAxis.beforeAnimate(100000, '');
    // const axisHeight = this.config.axis.label.height;
    // await this.renderBars({ x, y: y + axisHeight, width, height: height - axisHeight });
  }
  async start() {
    await this.render();
    // const length = this.config.data.length;
    // let { duration } = this.config;
    // while (this.index < length) {
    //   this.emit('change', this.index);
    //   await this.beforeAnimate();
    //   const dur = typeof duration === 'function' ? duration(this.index, length) : duration;
    //   await this.timer.start(dur);
    //   await this.afterAnimate();
    //   this.index++;
    //   await timeout(this.config.delay);
    // }
    // this.emit('end');
  }
}