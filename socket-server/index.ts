import { Server, Socket } from "socket.io";
import app from "./app";
import http from "http";
import { port } from "./constants";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import handleLogic from "./socketLogic/gameLogic";
import { authenticateTokenFunc } from "./middlewares/validateSchema";
import { IUserFromToken } from "./types/routesTypes";
import handleChatLogic from "./socketLogic/chatLogic";

const appPort = process.env.PORT || port;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const onConnection = (
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) => {
  const token = socket.handshake.auth.token;
  const user: IUserFromToken | false = authenticateTokenFunc(token);
  if (!user) {
    return socket.emit("err", "failed authenticating user");
  }
  handleLogic(io, socket, user);
  handleChatLogic(socket, io, user);
};

io.on("connection", onConnection);

server.listen(appPort, () => {
  console.log(`app listening on port ${appPort}`);
});
