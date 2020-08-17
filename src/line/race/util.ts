import { LineData } from './types';

export function parseDataByRank(data: LineData): void {
  data.columnNames.map((column, index) => {
    const values = data.data.map(item => item.values[index]);
    values.sort((a, b) => a < b ? 1 : -1);
    data.data.forEach(item => {
      item.values[index] = values.indexOf(item.values[index]) + 1;
    })
  })
}