import { CloudConfig } from './types';
import { chartConfig, fontFamily } from '../../common/config';

export const cloudConfig: CloudConfig = {
  ...chartConfig,
  mask: {
    fontFamily,
    fontSize: 450,
    fontWeight: 'bold',
    color: '#000'
  },
  gridSize: 8,
  minSize: 10,
  maxSize: 300,
  textStyle: {},
  debug: {
    drawGridItems: false,
    drawMaskImage: false,
    drawPoints: false
  },
  delay: 100,
  autoShrink: true,
  shrinkPercent: 0.9,
  shufflePoints: true,
  rotate: {
    disabled: false,
    min: -90,
    max: 90,
    step: 90
  }
};