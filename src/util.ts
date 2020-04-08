import { BarData, BarDataItem } from './config';
export function parseData(data: BarData, showNum: number = 10) {
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

export function splitValue(value: number, type: string = ',', num: number = 3) {
  const reg = new RegExp(`(?=(?!\\b)(\\d{${num}})+$)`, 'g');
  return (value + '').replace(reg, type);
}