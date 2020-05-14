import { CloudConfig } from './types';
import { chartConfig, fontFamily } from '../../common/config';

export const cloudConfig: CloudConfig = {
  ...chartConfig,
  mask: {
    fontFamily,
    fontSize: 30
  },
  gridSize: 8,
  weightFactor: 1,
  minFontSize: 0,
  textStyle: {},
  debug: true
};