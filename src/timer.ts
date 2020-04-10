import TWEEN from '@tweenjs/tween.js';

import { TimeData } from './type';

function animate() {
  requestAnimationFrame(animate);
  TWEEN.update();
}
requestAnimationFrame(animate);

export class Timer {
  private duration: number;
  private timerData: TimeData;
  private update: Function;
  private tween: TWEEN.Tween;
  constructor(duration: number, update: Function) {
    this.duration = duration;
    this.update = update;
  }
  animate() {
    this.timerData = { time: 0 };
    this.tween = new TWEEN.Tween(this.timerData).to({
      time: this.duration
    }, this.duration).easing(TWEEN.Easing.Linear.None).onUpdate(() => {
      const percent = this.timerData.time / this.duration;
      this.update(percent);
    });
    return new Promise(resolve => {
      this.tween.onComplete(() => {
        resolve();
      });
      this.tween.start();
    })
  }
}