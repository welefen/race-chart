import TWEEN from '@tweenjs/tween.js';

function animate() {
  requestAnimationFrame(animate);
  TWEEN.update();
}
requestAnimationFrame(animate);

interface TimeData {
  time: number;
}

type Callback = (object?: any) => void;

export class Timer {
  duration: number;
  private timerData: TimeData;
  private update: Callback = () => { };
  private complete: Callback = () => { };
  private tween: TWEEN.Tween;
  constructor(duration: number, update: Callback) {
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