import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import indicatorLocations from "../gameLogic/gameUtils/calcIndicators";
import updatePositions from "../gameLogic/gameUtils/updatePosition";
import { IndicatorInfo, IPieceInfoObject } from "../types/gameTypes";
import { retrieveGameObject } from "../userManegement/gameHandeling";
import { isCorrectPlayer, takeTurn } from "./utils";

const validateGame = (
  socket: Socket<DefaultEventsMap, DefaultEventsMap>,
  gameId: string
) => {};

const handleLogic = (
  io: Server<DefaultEventsMap, DefaultEventsMap>,
  socket: Socket<DefaultEventsMap, DefaultEventsMap>
) => {
  socket.on("join game", (gameId, userId) => {
    socket.join(gameId);
    socket.to(gameId).emit("joined game", userId);
  });

  socket.on(
    "select piece",
    (piece: IPieceInfoObject, gameId: string, userId: string) => {
      const gameObj = retrieveGameObject(gameId);
      if (!gameObj) {
        console.log("gameObj doesnt exist");
        return socket.emit(
          "game does not exist",
          new Error("game does not exist")
        );
      }
      if (!isCorrectPlayer(piece, userId, gameObj)) {
        console.log("incorrect player");
        return socket.emit("incorrect player", new Error("incorrect player"));
      }
      gameObj.gameinfo.selcetedPiece = piece;
      const positions = gameObj.gameinfo.positions;
      const turn = gameObj.gameinfo.turn;
      const indicators = indicatorLocations(piece, positions, turn, true);
      gameObj.gameinfo.indicators = indicators;
      return socket.emit("indicators", indicators, piece);
    }
  );

  socket.on(
    "take turn",
    (indicator: IndicatorInfo, gameId: string, userId: string) => {
      const gameObj = retrieveGameObject(gameId);
      if (!gameObj) {
        return socket.emit(
          "game does not exist",
          new Error("game does not exist")
        );
      }
      if (gameObj.gameinfo.selcetedPiece === null) {
        console.log("no selected piece");
        return socket.emit("please select a piece");
      }
      takeTurn(indicator, gameObj);
      io.in(gameId).emit("new game object", gameObj.gameinfo);
    }
  );
};

export default handleLogic;
