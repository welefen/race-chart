import { Group, Label } from 'spritejs';

import { ColumnTipConfig } from './type';
import { splitValue, createLabel, createGroup } from './util';
import { BarRace } from './index';

// 显示列和总数
export class ColumnTip {
  private config: ColumnTipConfig;
  private columnLabel: Label;
  private totalLabel: Label;
  private totalLabelHeight: number = 0;
  private group: Group;
  constructor(config: ColumnTipConfig) {
    this.config = config;
    this.group = createGroup(this.config);
  }
  appendTo(group: Group): Promise<void> {
    group.appendChild(this.group);
    return this.initTotal().then(() => {
      return this.initColumn();
    })
  }
  set totalOpacity(opacity: number) {
    this.totalLabel.attr({ opacity });
  }
  setTotalText(value: number) {
    const barTotal = this.config.barTotal;
    if (barTotal.disabled) return Promise.resolve();
    barTotal.value = value;
    const { type, length } = this.config.valueSplit;
    const text = splitValue(value, type, length);
    this.totalLabel.attr({
      width: this.config.width,
      text: `${barTotal.prefix}${text}`,
      textAlign: 'right'
    })
    return this.totalLabel.textImageReady.then(() => {
      const [_, height] = this.totalLabel.clientSize;
      this.totalLabelHeight = height;
      this.totalLabel.attr({
        y: this.config.height - height
      })
    })
  }
  private initTotal() {
    if (this.config.barTotal.disabled) return Promise.resolve();
    const barTotal = this.config.barTotal;
    const label = createLabel('', barTotal);
    this.totalLabel = label;
    this.group.appendChild(label);
    return this.setTotalText(barTotal.value || 0)
  }
  setColumnText(text: string) {
    this.columnLabel.attr({
      text,
      textAlign: 'right',
      width: this.config.width
    });
    return this.columnLabel.textImageReady.then(() => {
      const [_, height] = this.columnLabel.clientSize;
      this.columnLabel.attr({
        y: this.config.height - height - (this.totalLabelHeight || 0)
      })
    })
  }
  private initColumn() {
    const { barColumn } = this.config;
    const label = createLabel('', barColumn);
    this.columnLabel = label;
    this.group.appendChild(label);
    return this.setColumnText(barColumn.text);
  }
  beforeAnimate(barRace: BarRace) {
    const column = barRace.config.data.columnNames[barRace.index];
    this.setColumnText(column);
  }
  update(barRace: BarRace, percent: number) {
    const totals = barRace.config.data.totalValues;
    const prevTotal = barRace.index === 0 ? 0 : totals[barRace.index - 1];
    const total = totals[barRace.index];
    const value = Math.floor(prevTotal + (total - prevTotal) * percent);
    this.setTotalText(value);
  }
}