import { Server, Socket } from "socket.io";
import app from "./app";
import http from "http";
import { port } from "./constants";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

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
  // generateGameRoom(io, socket);
};

io.on("connection", onConnection);

server.listen(appPort, () => {
  console.log(`app listening on port ${appPort}`);
});
