import { CloudConfig } from './types';
import { chartConfig, fontFamily } from '../../common/config';

export const cloudConfig: CloudConfig = {
  ...chartConfig,
  mask: {
    fontFamily,
    fontSize: 30
  },
  gridSize: 8
};