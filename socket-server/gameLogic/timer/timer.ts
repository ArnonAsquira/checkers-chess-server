const oneSecondPromise = async () =>
  new Promise((resolve) => setTimeout(resolve, 1000));

const wait = async (time: number) =>
  new Promise((reolve) => setTimeout(reolve, time * 1000));

class Timer {
  time: number;
  acitvated: boolean;
  private initialTime: number;
  private break: boolean;
  constructor(initialTime: number) {
    this.initialTime = initialTime;
    this.time = initialTime;
    this.break = false;
    this.acitvated = false;
  }
  activate = async () => {
    this.break = false;
    if (this.acitvated) {
      return;
    }
    this.acitvated = true;
    for (let i = 0; i < this.time; i++) {
      if (this.break) {
        break;
      }
      await oneSecondPromise();
      this.time--;
    }
  };
  stop = () => {
    this.break = true;
    this.acitvated = false;
  };
  reset = () => {
    this.time = this.initialTime;
  };
}
export { wait };
export default Timer;
