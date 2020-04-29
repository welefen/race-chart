import TWEEN from '@tweenjs/tween.js';

interface TimeData {
  time: number;
}

type UPDATE_CALLBACK = (percent: number) => void;

function animate() {
  requestAnimationFrame(animate);
  TWEEN.update();
}
requestAnimationFrame(animate);

export class Timer {
  private duration: number;
  private timerData: TimeData;
  private update: UPDATE_CALLBACK;
  private tween: TWEEN.Tween;
  constructor(duration: number, update: UPDATE_CALLBACK) {
    this.duration = duration;
    this.update = update;
  }
  start(duration?: number, update?: UPDATE_CALLBACK) {
    duration = duration || this.duration;
    update = update || this.update;
    this.timerData = { time: 0 };
    this.tween = new TWEEN.Tween(this.timerData).to({
      time: duration
    }, duration).easing(TWEEN.Easing.Linear.None).onUpdate(() => {
      const percent = this.timerData.time / duration;
      update(percent);
    });
    return new Promise(resolve => {
      this.tween.onComplete(() => {
        resolve();
      });
      this.tween.start();
    })
  }
  stop() {
    if (this.tween) {
      this.tween.stop();
    }
  }
}