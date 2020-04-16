import { Label, Group } from 'spritejs';
import merge from 'deepmerge';

import { FormatterType, BarData, BarDataItem, SortType, Font, Position } from './type';

export function deepmerge<T extends Record<string, any>>(...source: T[]): T {
  const data = merge.all(source, {
    arrayMerge: (_, sourceArray) => sourceArray,
  });
  return <T>data;
}

/**
 * 移除完全不会显示的数据，减少创建的 bar 个数
 * @param data 
 * @param showNum 
 */
export function parseData(data: BarData, showNum: number = 10): BarData {
  const set = new Set();
  const totals: number[] = [];
  data.data.forEach((item, index) => {
    if (item.index === undefined) {
      item.index = index;
    }
  })
  data.columnNames.forEach((_, index) => {
    let total = 0;
    data.data.forEach(item => {
      total += item.values[index];
    })
    totals.push(total);
    data.data.sort((a, b) => {
      const aValue = a.values[index];
      const bValue = b.values[index];
      if (aValue === bValue) {
        return a.index > b.index ? 1 : -1;
      }
      return aValue < bValue ? 1 : -1;
    })
    data.data.slice(0, showNum).forEach(item => {
      set.add(item);
    })
  })
  data.data = <BarDataItem[]>Array.from(set);
  data.totalValues = totals;
  return data;
}

export function formatter(value: number, type: FormatterType): string {
  return (value + '').replace(/(?=(?!\b)(\d{3})+$)/g, ',');
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
  const { fontSize, fontStretch, fontFamily, fontWeight, fontStyle, fontVariant, lineHeight, color, opactiy } = config;
  label.attr({
    fontSize,
    fontFamily,
    fontWeight,
    fontStyle,
    fontStretch,
    fontVariant,
    lineHeight,
    opactiy,
    fillColor: color
  })
  return label;
}

export function createGroup(config?: Position): Group {
  const { x, y, width, height } = config;
  return new Group({ x, y, width, height });
}