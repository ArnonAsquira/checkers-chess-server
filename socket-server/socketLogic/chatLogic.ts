import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { IUserFromToken } from "../types/routesTypes";

const handleChatLogic = (
  socket: Socket<DefaultEventsMap, DefaultEventsMap>,
  io: Server<DefaultEventsMap, DefaultEventsMap>,
  user: IUserFromToken
) => {
  socket.on("message", (content, gameId) => {
    io.in(gameId).emit("message", { userName: user.userName, content });
  });
};

export default handleChatLogic;
