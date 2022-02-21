import { Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

interface ISocketObj {
  socket: Socket<DefaultEventsMap, DefaultEventsMap>;
  socketId: string;
  userId: string;
}

export type { ISocketObj };
