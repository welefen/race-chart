import TWEEN from '@tweenjs/tween.js';
import { Scene, Label } from "spritejs";
import { BarManage } from './barManage';


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
      height: 540
    })
    layer.append(barmange.group);


    function animate() {
      requestAnimationFrame(animate);
      TWEEN.update();
    }
    requestAnimationFrame(animate);

  }
}