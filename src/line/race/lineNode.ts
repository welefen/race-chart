import { Group, Polyline, Block, Label } from 'spritejs';
import { LineNodeConfig } from './types';
import { createGroup, createLabel } from '../../common/util';
export class LineNode {
  private group: Group;
  private config: LineNodeConfig;
  private lines: Polyline[];
  private labelGroup: Group;
  private labelValue: Label;
  public values: number[];
  constructor(config: LineNodeConfig, values: number[]) {
    this.config = config;
    this.group = createGroup(config);
    this.values = values;
  }
  private async initLine() {
    const { color, shadeOpacity, shadeWidth, width } = this.config.line;
    let points = [];
    const line = new Polyline({
      points,
      close: false,
      strokeColor: color,
      lineWidth: shadeWidth,
      lineCap: 'square',
      opacity: shadeOpacity,
      smooth: false
    });
    this.group.appendChild(line);
    const line2 = new Polyline({
      points,
      close: false,
      strokeColor: color,
      lineWidth: width,
      lineCap: 'square',
      smooth: false
    });
    this.group.appendChild(line2);
    this.lines = [line, line2];

    this.labelGroup = createGroup({ x: 0, y: 0, width: 10, height: 10 });
    this.labelGroup.attr({ opacity: 0 });
    this.group.appendChild(this.labelGroup);
    const { radius } = this.config.circle;
    const circle = new Block({
      bgcolor: color,
      width: radius,
      height: radius,
      x: -radius / 2,
      y: -radius / 2,
      borderRadius: radius,
    })
    this.labelGroup.appendChild(circle);

    const { label } = this.config;
    const labelNode = createLabel(label.text, label);
    labelNode.attr({
      height: radius,
      lineHeight: radius,
      fillColor: color,
      x: radius / 2 + this.config.justifySpacing,
      y: -radius / 2
    });
    this.labelGroup.appendChild(labelNode);

    await labelNode.textImageReady;
    const [labelWidth, _] = labelNode.clientSize;

    // 数字
    const { value } = this.config;
    const valueNode = createLabel('', value);
    if (this.config.value.pos === 'inside') {
      valueNode.attr({
        fillColor: '#fff',
        height: radius,
        width: radius,
        lineHeight: radius,
        textAlign: 'center',
        x: -radius / 2,
        y: -radius / 2,
      })
    } else {
      valueNode.attr({
        fillColor: color,
        height: radius,
        lineHeight: radius,
        x: radius / 2 + this.config.justifySpacing * 2 + labelWidth,
        y: -radius / 2
      });
    }
    this.labelGroup.appendChild(valueNode);
    this.labelValue = valueNode;
  }
  update(points: number[], value: number) {
    this.lines.forEach(line => {
      line.attr({ points })
    })
    if (points.length) {
      const length = points.length;
      this.labelGroup.attr({
        opacity: 1,
        x: points[length - 2],
        y: points[length - 1]
      })
      this.labelValue.attr({ text: value.toString() });
    }
  }
  appendTo(parent: Group) {
    parent.appendChild(this.group);
    this.initLine();
  }
}