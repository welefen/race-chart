import { BarData, BarDataItem } from './types';
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
    data.data.slice(0, showNum).filter(item => item.values[index]).forEach(item => {
      set.add(item);
    })
  })
  data.data = <BarDataItem[]>Array.from(set);
  data.totalValues = totals;
  return data;
}

export function sortValues(values: BarDataItem[], index: number, type: string): void {
  const [i, j] = type === 'asc' ? [-1, 1] : [1, -1];
  values.sort((a, b) => {
    if (a.values[index] === b.values[index]) {
      return a.label.length > b.label.length ? 1 : -1;
    }
    return a.values[index] < b.values[index] ? i : j;
  })
}