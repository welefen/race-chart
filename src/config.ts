import { ValueSplitConfig, BarRaceConfig, TitleConfig, AxisConfig, BarColumnConfig, BarLabelConfig, BarRectConfig, BarValueConfig, BarTotalConfig } from './type';

const valueSplit: ValueSplitConfig = {
  type: ',',
  length: 3
}
const fontFamily: string = '"宋体"';
const colors: string[] = '#1D6996|#EDAD08|#73AF48|#94346E|#38A6A5|#E17C05|#5F4690|#0F8554|#6F4070|#CC503E|#994E95|#666666'.split('|');

const axis: AxisConfig = {
  maxTick: 4,
  color: '#666',
  lineColor: '#eee',
  fontSize: 12,
  fontFamily
}

const barColumn: BarColumnConfig = {
  text: '2011',
  fontSize: 78,
  color: '#bbb',
  fontFamily,
  fontWeight: 'bold'
}

const barLabel: BarLabelConfig = {
  fontSize: 16,
  fontFamily,
  color: '#333',
  width: 100
}
const barRect: BarRectConfig = {
  minWidth: 10,
  width: 0,
  color: 'red',
}

const barValue: BarValueConfig = {
  value: 0,
  fontSize: 14,
  fontFamily,
  color: '#333',
  width: 100
}

const title: TitleConfig = {
  fontSize: 30,
  fontFamily,
  color: '#333',
  align: 'center'
};

const barTotal: BarTotalConfig = {
  disabled: false,
  prefix: 'Total:',
  fontFamily,
  color: '#333'
}

export const defaultBarRace: BarRaceConfig = {
  width: 960,
  height: 540,
  displayRatio: 2,
  valueSplit,
  axis,
  title,
  barLabel,
  barRect,
  barValue,
  barTotal,
  barColumn,
  duration: 2000,
  alignSpacing: 5,
  justifySpacing: 5,
  scaleType: 'dynamic',
  sortType: 'desc',
  showNum: 10,
  colors,
}