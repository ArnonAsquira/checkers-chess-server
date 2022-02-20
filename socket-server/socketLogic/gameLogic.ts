import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import indicatorLocations from "../gameLogic/gameUtils/calcIndicators";
import updatePositions from "../gameLogic/gameUtils/updatePosition";
import {
  IGameInfo,
  IGameObject,
  IndicatorInfo,
  IPieceInfoObject,
} from "../types/gameTypes";
import { retrieveGameObject } from "../userManegement/gameHandeling";
import { isCorrectPlayer, takeTurn } from "./utils";

interface ISocketMiddlewareResponse<T> {
  success: boolean;
  message: T;
}

const makeMiddlewareResponse = <T>(
  success: boolean,
  message: T
): ISocketMiddlewareResponse<T> => ({ success, message });

const validateGame = (
  socket: Socket<DefaultEventsMap, DefaultEventsMap>,
  gameId: string
): ISocketMiddlewareResponse<string | IGameObject> => {
  const gameObj = retrieveGameObject(gameId);
  if (!gameObj) {
    socket.emit("game does not exist", new Error("game does not exist"));
    return makeMiddlewareResponse(false, "game object doesnt exist");
  }
  return makeMiddlewareResponse(true, gameObj);
};

const handleLogic = (
  io: Server<DefaultEventsMap, DefaultEventsMap>,
  socket: Socket<DefaultEventsMap, DefaultEventsMap>
) => {
  socket.on("join game", (gameId) => {
    const gameObjectResponse = validateGame(socket, gameId);
    if (!gameObjectResponse.success) return;
    const gameObj = gameObjectResponse.message as IGameObject;
    socket.join(gameId);
    socket
      .to(gameId)
      .emit("joined game", gameObj.playerTwo && gameObj.playerTwo.userName);
  });

  socket.on(
    "select piece",
    (piece: IPieceInfoObject, gameId: string, userId: string) => {
      const gameObjectResponse = validateGame(socket, gameId);
      if (!gameObjectResponse.success) return;
      const gameObj = gameObjectResponse.message as IGameObject;
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
      const gameObjectResponse = validateGame(socket, gameId);
      if (!gameObjectResponse.success) return;
      const gameObj = gameObjectResponse.message as IGameObject;
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
