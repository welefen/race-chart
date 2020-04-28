import { barTrendConfig, barConfig } from '../common/config';
import { BarRaceConfig, BarTotalConfig, BarColumnConfig } from './types';
import { fontFamily } from '../../common/config';
import { BarConfig } from './types';

const total: BarTotalConfig = {
  disabled: false,
  prefix: 'Total: ',
  fontSize: 22,
  fontFamily,
  color: '#aaa',
  align: 'right',
}

const column: BarColumnConfig = {
  text: '',
  fontSize: 80,
  color: '#bbb',
  fontFamily,
  fontWeight: 'bold',
  align: 'right'
}

const bar: BarConfig = {
  ...barConfig,
  total,
  column
}

export const barRaceConfig: BarRaceConfig = {
  ...barTrendConfig,
  bar
}