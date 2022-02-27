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
import {
  removeGame,
  retrieveGameObject,
} from "../userManegement/gameHandeling";
import {
  checkeVictory,
  handleTimer,
  handleWin,
  isCorrectPlayer,
  isValidPiece,
  playerNum,
  takeTurn,
  updateGameResualts,
} from "./utils";
import {
  pushToSocket,
  removeScoket,
  retrieveSocket,
  retrieveUserId,
  socketArray,
} from "./socketArray";

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
    socket.emit("err", "game does not exist");
    return makeMiddlewareResponse(false, "game object doesnt exist");
  }
  return makeMiddlewareResponse(true, gameObj);
};

const handleLogic = (
  io: Server<DefaultEventsMap, DefaultEventsMap>,
  socket: Socket<DefaultEventsMap, DefaultEventsMap>
) => {
  const socketId = socket.id;
  let globalGameId: string | null = null;

  socket.on("join game", (gameId, userId) => {
    const gameObjectResponse = validateGame(socket, gameId);
    globalGameId = gameId;
    if (!gameObjectResponse.success) return;
    const gameObj = gameObjectResponse.message as IGameObject;
    pushToSocket({ socketId, userId, socket });
    socket.join(gameId);
    socket
      .to(gameId)
      .emit(
        "joined game",
        gameObj.playerTwo && gameObj.playerTwo.userName,
        gameObj.playerTwo && gameObj.playerTwo.timer.time
      );
    if (gameObj.playerOne && gameObj.playerTwo) {
      const playerOneSocket = retrieveSocket(gameObj.playerOne.id);
      const playerTwoScoket = retrieveSocket(gameObj.playerTwo.id);
      if (playerOneSocket && playerTwoScoket) {
        handleTimer(gameObj, playerOneSocket);
        handleTimer(gameObj, playerTwoScoket);
      }
    }
  });

  socket.on("disconnect", () => {
    if (globalGameId !== null) {
      const gameObjectResponse = validateGame(socket, globalGameId);
      if (!gameObjectResponse.success) return;
      const gameObj = gameObjectResponse.message as IGameObject;
      const playerId = retrieveUserId(socketId);
      if (!playerId) return;
      const playerNumber = playerNum(gameObj, playerId);
      updateGameResualts(playerNumber, gameObj);
      socket.to(globalGameId).emit("player disconnected", playerNumber);
      removeGame(globalGameId);
      removeScoket(playerId);
      globalGameId = null;
    }
  });

  socket.on(
    "select piece",
    (piece: IPieceInfoObject, gameId: string, userId: string) => {
      const gameObjectResponse = validateGame(socket, gameId);
      if (!gameObjectResponse.success) return;
      const gameObj = gameObjectResponse.message as IGameObject;
      if (gameObj.playerTwo === null) {
        return socket.to(gameId).emit("err", "game is not full");
      }
      if (!isCorrectPlayer(piece, userId, gameObj)) {
        console.log("incorrect player");
        return socket.emit("err", "incorrect player");
      }
      if (isValidPiece(piece, gameObj.gameinfo)) {
        gameObj.gameinfo.selcetedPiece = piece;
      } else {
        return socket.emit("err", "you cant use this piece in this turn");
      }
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
      const winner = checkeVictory(gameObj.gameinfo);
      io.in(gameId).emit("new game object", gameObj.gameinfo);
      if (winner !== 0) {
        handleWin(gameObj, winner === 1 ? 2 : 1);
      }
    }
  );
};

export default handleLogic;
