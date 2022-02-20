import { Server, Socket } from "socket.io";
import app from "./app";
import http from "http";
import { port } from "./constants";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import handleLogic from "./socketLogic/gameLogic";

const appPort = port || process.env.PORT;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const onConnection = (
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) => {
  handleLogic(io, socket);
};

io.on("connection", onConnection);

server.listen(appPort, () => {
  console.log(`app listening on port ${appPort}`);
});
