import { LineGroupConfig } from './types';
import { Group, Layer } from 'spritejs';
import { createGroup } from '../../common/util';
import { LineNode } from './lineNode';
export class LineGroup {
  private config: LineGroupConfig;
  private group: Group;
  private lineNodes: LineNode[] = [];
  constructor(config: LineGroupConfig) {
    this.config = config;
    this.group = createGroup(config);
    this.initLineNodes();
  }
  public initLineNodes() {
    const { colors } = this.config;
    this.lineNodes = this.config.data.data.slice(0, 1).map((item, index) => {
      const instance = new LineNode({
        color: colors[index % colors.length]
      });
      instance.appendTo(this.group);
      return instance;
    })
  }
  public appendTo(layer: Layer) {
    layer.appendChild(this.group);
  }
}