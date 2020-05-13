import { Chart } from '../../common/chart';
import { DynamicAxis } from '../../common/axis/dynamic';
import { FixedAxis } from '../../common/axis/fixed';
import { LineRaceConfig } from './types';
import { lineRaceConfig } from './config';
import { deepmerge } from '../../common/util';
import { LineGroup } from './lineGroup';
import { parseDataByRank } from './util';

export class LineRace extends Chart {
  private index: number = 0;
  private yAxis: DynamicAxis | FixedAxis;
  private xAxis: FixedAxis;
  private lineGroup: LineGroup;
  private maxValues: number[];
  config: LineRaceConfig;
  setConfig(config: LineRaceConfig) {
    config = deepmerge({}, lineRaceConfig, this.config || {}, config);
    if (config.scoreType === 'rank') {
      parseDataByRank(config.data);
    }
    super.setConfig(config);
    this.initMaxValues();
  }
  private initMaxValues() {
    const { columnNames, data } = this.config.data;
    if (this.config.scoreType === 'score') {
      let values: number[] = columnNames.map((_, idx) => {
        const values = data.map(item => item.values[idx]);
        return Math.max(...values) / 0.9;
      })
      this.maxValues = values;
    } else {
      const { data, columnNames } = this.config.data;
      this.maxValues = [...new Array(columnNames.length)].fill(data.length);
    }
  }

  private renderYAxis(x: number, y: number, width: number, height: number) {
    if (this.config.scoreType === 'score') {
      this.yAxis = new DynamicAxis({
        type: 'row',
        x,
        y,
        width,
        height,
        ...this.config.yAxis,
      });
      this.yAxis.appendTo(this.layer);
    } else {
      const length = this.config.data.data.length;
      this.yAxis = new FixedAxis({
        type: 'row',
        x, y,
        width,
        height,
        ...this.config.yAxis,
        maxTick: length - 1,
      })
      const columns = [...new Array(length)].map((_, index) => (index + 1).toString());
      this.yAxis.appendTo(this.layer);
      this.yAxis.initTicks(columns);
    }
  }
  private renderXAxis(x: number, y: number, width: number, height: number) {
    this.xAxis = new FixedAxis({
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
    let yAxisY = y;
    if (this.config.xAxis.label.pos === 'top') {
      yAxisY = y + xAxisLabelHeight;
    }
    const labelWidth = this.config.line.label.width;
    this.renderYAxis(x, yAxisY, width - labelWidth, height - xAxisLabelHeight);

    this.renderXAxis(x + yAxisLabelWidth, y, width - yAxisLabelWidth - labelWidth, height);
    this.xAxis.initTicks(this.config.data.columnNames);

    const lineGroup = new LineGroup({
      ...this.config,
      x: x + yAxisLabelWidth,
      y: yAxisY,
      width: width - yAxisLabelWidth - labelWidth,
      height: height - xAxisLabelHeight
    })
    lineGroup.appendTo(this.layer);
    this.lineGroup = lineGroup;
  }
  async start() {
    await this.render();
    const length = this.config.data.columnNames.length;
    let { duration } = this.config;
    while (this.index < length) {
      this.emit('change', this.index);
      await this.beforeAnimate();
      const dur = typeof duration === 'function' ? duration(this.index, length) : duration;
      await this.timer.start(dur);
      await this.afterAnimate();
      this.index++;
    }
    await this.renderLastStayTime();
    await this.renderEndingImage();
    this.emit('end');
  }
  private beforeAnimate() {
    const maxValue = this.maxValues[this.index];
    if (this.config.scoreType === 'score') {
      this.yAxis.beforeAnimate({ maxValue, index: this.index });
    }
    this.xAxis.beforeAnimate({ index: this.index });
  }
  protected onUpdate(percent: number) {
    const oldMaxValue = this.maxValues[Math.max(0, this.index - 1)];
    const maxValue = this.maxValues[this.index];
    if (this.config.scoreType === 'score') {
      this.yAxis.onUpdate({ oldMaxValue, maxValue, percent, index: this.index });
    }
    this.lineGroup.onUpdate({ index: this.index, percent, oldMaxValue, maxValue });
    this.xAxis.onUpdate({ index: this.index, percent });
  }
  private afterAnimate() {
    if (this.config.scoreType === 'score') {
      this.yAxis.afterAnimate({ index: this.index });
    }
    this.lineGroup.afterAnimate();
    this.xAxis.afterAnimate({ index: this.index });
  }
}