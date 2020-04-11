import { Label, Group } from 'spritejs';

import { BarData, BarDataItem, SortType, Font, Position } from './type';

/**
 * 移除完全不会显示的数据，减少创建的 bar 个数
 * @param data 
 * @param showNum 
 */
export function parseData(data: BarData, showNum: number = 10): BarData {
  const set = new Set();
  const totals: number[] = [];
  data.columnNames.forEach((_, index) => {
    let values = data.data.map(item => item.values[index]);
    values.sort((a, b) => a < b ? 1 : -1);
    values = values.slice(0, showNum);
    let total = 0;
    data.data.forEach(item => {
      const value = item.values[index];
      total += value;
      if (values.indexOf(value) > -1) {
        set.add(item);
      }
    })
    totals.push(total);
  })
  data.data = <BarDataItem[]>Array.from(set);
  data.totalValues = totals;
  return data;
}

export function splitValue(value: number, type: string = ',', num: number = 3): string {
  const reg = new RegExp(`(?=(?!\\b)(\\d{${num}})+$)`, 'g');
  return (value + '').replace(reg, type);
}

export function sortValues(values: BarDataItem[], index: number, type: SortType): void {
  const [i, j] = type === 'asc' ? [-1, 1] : [1, -1];
  values.sort((a, b) => {
    if (a.values[index] === b.values[index]) {
      return a.label.length > b.label.length ? 1 : -1;
    }
    return a.values[index] < b.values[index] ? i : j;
  })
}
export function parseCombineValue(value: number | number[]): number[] {
  if (!value) return [0, 0, 0, 0];
  if (!Array.isArray(value)) {
    value = [value, value, value, value];
  } else if (value.length === 1) {
    value = [value[0], value[0], value[0], value[0]];
  } else if (value.length === 2) {
    value = [value[0], value[1], value[0], value[1]];
  } else if (value.length === 3) {
    value[3] = value[1];
  }
  return value;
}

/**
 * create label
 * @param text string
 * @param config 
 */
export function createLabel(text?: string, config?: Font): Label {
  const label = new Label(text || '');
  const { fontSize, fontStretch, fontFamily, fontWeight, fontStyle, fontVariant, lineHeight, color } = config;
  label.attr({
    fontSize,
    fontFamily,
    fontWeight,
    fontStyle,
    fontStretch,
    fontVariant,
    lineHeight,
    fillColor: color
  })
  return label;
}

export function createGroup(config?: Position): Group {
  const { x, y, width, height } = config;
  return new Group({ x, y, width, height });
}