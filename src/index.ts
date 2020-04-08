import TWEEN from '@tweenjs/tween.js';
import { Scene } from "spritejs";
import { BarManage } from './barManage';
import BarData from './data';
import { parseData } from './util';

function animate() {
  requestAnimationFrame(animate);
  TWEEN.update();
}
requestAnimationFrame(animate);

export class BarRace {
  barManage: BarManage;
  constructor() {
    const scene = new Scene({
      container: document.querySelector('#container'),
      width: 960,
      height: 540,
      displayRatio: 2
    })
    const layer = scene.layer();
    this.barManage = new BarManage({
      width: 960,
      height: 500,
      y: 20,
      data: parseData(BarData, 10),
      showNum: 10,
      alignSpacing: 5,
      justifySpacing: 5,
    })
    this.barManage.appendTo(layer);
  }
  async update() {
    await Promise.all(this.barManage.promises);
    this.barManage.update();
  }
}