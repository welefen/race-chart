import { Group, Polyline } from 'spritejs';
import { LineNodeConfig } from './types';
import { createGroup } from '../../common/util';
export class LineNode {
  private group: Group;
  private config: LineNodeConfig;
  constructor(config: LineNodeConfig) {
    this.config = config;
    this.group = createGroup(config);
  }
  private initLine() {
    let points = [110, 10, 105, 100, 200, 200, 200, 300, 300, 400, 500, 200];
    const line = new Polyline({
      points,
      close: false,
      strokeColor: this.config.color,
      lineWidth: 22,
      lineCap: 'square',
      opacity: 0.2
    });
    this.group.appendChild(line);
    const line2 = new Polyline({
      points,
      close: false,
      strokeColor: this.config.color,
      lineWidth: 6,
      lineCap: 'square',
    });
    this.group.appendChild(line2);
  }
  appendTo(parent: Group) {
    parent.appendChild(this.group);
    this.initLine();
  }
}