import { Server } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

const oneSecondPromise = async () =>
  new Promise((resolve) => setTimeout(resolve, 1000));

const wait = async (time: number) =>
  new Promise((reolve) => setTimeout(reolve, time * 1000));

class SocketTimer {
  time: number;
  private initialTime: number;
  private break: boolean;
  private io: Server<DefaultEventsMap, DefaultEventsMap>;
  private gameId: string;
  private playerNumber: 1 | 2;
  constructor(
    initialTime: number,
    io: Server<DefaultEventsMap, DefaultEventsMap>,
    gameId: string,
    playerNumber: 1 | 2
  ) {
    this.initialTime = initialTime;
    this.time = initialTime;
    this.break = false;
    this.io = io;
    this.gameId = gameId;
    this.playerNumber = playerNumber;
  }
  activate = async () => {
    this.break = false;
    for (let i = 0; i < this.time; i++) {
      if (this.break) {
        break;
      }
      await oneSecondPromise();
      this.time--;
      this.io.in(this.gameId).emit("time decreased", this.playerNumber);
    }
  };
  stop = () => {
    this.break = true;
  };
  reset = () => {
    this.time = this.initialTime;
  };
}
export default SocketTimer;
