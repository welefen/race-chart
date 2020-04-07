import TWEEN from '@tweenjs/tween.js';
import { Scene } from "spritejs";
import { BarManage } from './barManage';
import BarData from './data';
import { parseData } from './util';


export class BarRace {
  constructor() {
    const scene = new Scene({
      container: document.querySelector('#container'),
      width: 960,
      height: 540,
      displayRatio: 2
    })
    const layer = scene.layer();
    const barmange = new BarManage({
      width: 960,
      height: 500,
      y: 20,
      data: parseData(BarData, 10),
      showNum: 10,
      alignSpacing: 5,
      justifySpacing: 5,
    })
    layer.append(barmange.group);

    function animate() {
      requestAnimationFrame(animate);
      TWEEN.update();
    }
    requestAnimationFrame(animate);

  }
}