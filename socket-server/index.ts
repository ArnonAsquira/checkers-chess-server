import { Server } from "socket.io";

const io = new Server(8081);

io.on("connection", (socket) => {
  console.log(socket);
});
