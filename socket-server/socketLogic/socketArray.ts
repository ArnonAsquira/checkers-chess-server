import { Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { ISocketObj } from "../types/socketTypes";

let socketArray: ISocketObj[] = [];

// const killExistingSockets = (userId: string)=> {
//      for (let )
// }
const pushToSocket = (socketObjProp: ISocketObj) => {
  socketArray = socketArray.filter(
    (socketObj) => socketObj.userId !== socketObjProp.userId
  );
  socketArray.push(socketObjProp);
};

const retrieveSocket = (
  userId: string
): undefined | Socket<DefaultEventsMap, DefaultEventsMap> => {
  const socketObj = socketArray.find(
    (socketObj) => socketObj.userId === userId
  );
  if (socketObj === undefined) {
    return undefined;
  }
  return socketObj.socket;
};

const retrieveUserId = (socketId: string): string | undefined => {
  const socketObj = socketArray.find(
    (socketObj) => socketObj.socketId === socketId
  );
  if (socketObj === undefined) return undefined;
  return socketObj.userId;
};

const removeScoket = (userId: string) => {
  const socketIndex = socketArray.findIndex(
    (socketObj) => socketObj.userId === userId
  );
  if (socketIndex === -1) {
    return;
  }
  socketArray.splice(socketIndex, 1);
};
export {
  retrieveSocket,
  removeScoket,
  pushToSocket,
  retrieveUserId,
  socketArray,
};
