import { barTrendConfig, barConfig } from '../common/config';
import { BarRankConfig, RankConfig } from './types';
import { fontFamily } from '../../common/config';

const rank: RankConfig = {
  fontFamily,
  fontSize: 60,
  color: '#aaa',
  formatter(index) {
    return `第${index}名`;
  }
}

export const barRankConfig: BarRankConfig = {
  ...barTrendConfig,
  delay: 300,
  bar: {
    ...barConfig,
    rank
  }
}