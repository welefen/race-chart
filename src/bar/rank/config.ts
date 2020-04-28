import { barTrendConfig, barConfig } from '../common/config';
import { BarRankConfig, RankConfig } from './types';
import { fontFamily } from '../../common/config';

const rank: RankConfig = {
  fontFamily,
  fontSize: 60,
  color: '#aaa',
  padding: [0, 20, 10, 0],
  formatter(index) {
    return `第${index}名`;
  }
}

export const barRankConfig: BarRankConfig = {
  ...barTrendConfig,
  bar: {
    ...barConfig,
    rank
  }
}