import { colorOne, colorTwo } from "../gameLogic/constants";
import indicatorLocations from "../gameLogic/gameUtils/calcIndicators";
import { adjacentPieces } from "../gameLogic/gameUtils/calcMandatoryPieces";
import updatePositions from "../gameLogic/gameUtils/updatePosition";
import arrayEqual, {
  arrayIncludes,
} from "../gameLogic/generalUtils/arrayEqual";
import oppositeColor from "../gameLogic/generalUtils/oppositeColor";
import { User } from "../mongo/userSchema";
import {
  IGameInfo,
  IGameObject,
  IndicatorInfo,
  IPieceInfoObject,
} from "../types/gameTypes";
import mongoose from "mongoose";
import {
  removeGame,
  retrieveGameObject,
} from "../userManegement/gameHandeling";
import { retrieveSocket, socketArray } from "./socketArray";
import { Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { wait } from "../gameLogic/timer/timer";
const ObjectId = mongoose.Types.ObjectId;

const switchTimer = (gameObj: IGameObject, playerNumber: 1 | 2) => {
  if (!gameObj.playerOne || !gameObj.playerTwo) return;
  if (playerNumber === 1) {
    if (!gameObj.playerOne.timer.acitvated) {
      gameObj.playerOne.timer.activate();
    }
    if (gameObj.playerTwo.timer.acitvated) {
      gameObj.playerTwo.timer.stop();
    }
  } else {
    if (!gameObj.playerTwo.timer.acitvated) {
      gameObj.playerTwo.timer.activate();
    }
    if (gameObj.playerOne.timer.acitvated) {
      gameObj.playerOne.timer.stop();
    }
  }
};

const handleTimer = async (
  gameId: string,
  socket: Socket<DefaultEventsMap, DefaultEventsMap>
) => {
  let gameObj = retrieveGameObject(gameId);
  while (
    gameObj &&
    gameObj.playerOne &&
    gameObj.playerOne.id &&
    gameObj.playerTwo &&
    gameObj.playerTwo.id
  ) {
    await wait(1);
    socket.emit("update time", {
      playerOne: gameObj.playerOne.timer.time,
      playerTwo: gameObj.playerTwo.timer.time,
    });
    if (gameObj.playerOne.timer.time === 0) {
      handleWin(gameObj, 1);
    } else if (gameObj.playerTwo.timer.time === 0) {
      handleWin(gameObj, 2);
    }
    gameObj = retrieveGameObject(gameId);
  }
};

const playerNum = (gameObj: IGameObject, userId: string) => {
  if (gameObj.playerOne && gameObj.playerOne.id === userId) {
    return 1;
  }
  if (gameObj.playerTwo && gameObj.playerTwo.id === userId) {
    return 2;
  }
  return 0;
};

const checkeVictory = (gameinfo: IGameInfo): 1 | 2 | 0 => {
  if (
    gameinfo.positions.red.length > 0 &&
    gameinfo.positions.blue.length === 0
  ) {
    return 1;
  }
  if (
    gameinfo.positions.blue.length > 0 &&
    gameinfo.positions.red.length === 0
  ) {
    return 2;
  }
  return 0;
};

const validatePlayersTurn = (playerId: string, gameObj: IGameObject) => {
  if (
    (gameObj.gameinfo.turn === colorOne &&
      gameObj.playerOne !== null &&
      gameObj.playerOne.id !== playerId) ||
    (gameObj.gameinfo.turn === colorTwo &&
      gameObj.playerTwo !== null &&
      gameObj.playerTwo.id !== playerId)
  ) {
    return false;
  }
  return true;
};

const isCorrectPlayer = (
  piece: IPieceInfoObject,
  player: string,
  gameObj: IGameObject
): boolean => {
  if (
    !arrayIncludes(
      piece.location,
      gameObj.gameinfo.positions[gameObj.gameinfo.turn].map(
        (piece) => piece.location
      )
    )
  ) {
    return false;
  }
  return validatePlayersTurn(player, gameObj);
};

const takeTurn = (indicator: IndicatorInfo, gameObj: IGameObject) => {
  if (gameObj.gameinfo.selcetedPiece === null) {
    return console.log("no piece selceted");
  }
  // updating positions reflecting turn
  const newPositions = updatePositions(
    gameObj.gameinfo.turn,
    gameObj.gameinfo.selcetedPiece,
    indicator,
    gameObj.gameinfo.positions
  );
  gameObj.gameinfo.positions = newPositions;
  /*************************************************************************/
  // checking for consecutive danger
  const newPieceInfo = gameObj.gameinfo.positions[gameObj.gameinfo.turn].find(
    (pieceInfo) => arrayEqual(indicator.location, pieceInfo.location)
  );
  if (!newPieceInfo) {
    return console.log("could not find new piece info");
  }
  const consecutiveDangerIndicators = indicatorLocations(
    newPieceInfo,
    gameObj.gameinfo.positions,
    gameObj.gameinfo.turn,
    false
  ).filter((info) => info.endangers);
  if (consecutiveDangerIndicators.length > 0 && indicator.endangers) {
    gameObj.gameinfo.isFirst = false;
    gameObj.gameinfo.selcetedPiece = newPieceInfo;
    gameObj.gameinfo.indicators = consecutiveDangerIndicators;
    gameObj.gameinfo.mandatoryMove = consecutiveDangerIndicators;
    return;
  } else {
    gameObj.gameinfo.turn = oppositeColor(gameObj.gameinfo.turn);
    const mandatoryMoves = adjacentPieces(
      gameObj.gameinfo.positions,
      gameObj.gameinfo.turn
    );
    if (mandatoryMoves.length > 0) {
      gameObj.gameinfo.mandatoryMove = mandatoryMoves;
      gameObj.gameinfo.indicators = mandatoryMoves;
    } else {
      gameObj.gameinfo.indicators = [];
      gameObj.gameinfo.mandatoryMove = [];
    }
    gameObj.gameinfo.selcetedPiece = null;
  }
  switchTimer(gameObj, gameObj.gameinfo.turn === "red" ? 1 : 2);
};

const updateVictory = async (userId: string, opponentId: string) => {
  await User.updateOne(
    { _id: new ObjectId(userId) },
    {
      $push: {
        "checkersData.wins": {
          id: new ObjectId(opponentId),
          date: new Date().toString(),
        },
      },
    }
  );
};

const updateLose = async (userId: string, opponentId: string) => {
  await User.updateOne(
    { _id: new ObjectId(userId) },
    {
      $push: {
        "checkersData.loses": {
          id: new ObjectId(opponentId),
          date: new Date().toString(),
        },
      },
    }
  );
};

const updateGameResualts = (loserNumber: number, gameObj: IGameObject) => {
  if (!gameObj.playerTwo || !gameObj.playerOne) {
    return;
  }
  const winnerId =
    loserNumber === 1 ? gameObj.playerTwo.id : gameObj.playerOne.id;
  const loserId =
    loserNumber === 1 ? gameObj.playerOne.id : gameObj.playerTwo.id;
  updateVictory(winnerId, loserId);
  updateLose(loserId, winnerId);
};

const handleWin = (gameObj: IGameObject, loserNum: 1 | 2) => {
  updateGameResualts(loserNum, gameObj);
  if (!gameObj.playerOne || !gameObj.playerTwo)
    return console.log("undefined players");
  const winnerId = loserNum === 1 ? gameObj.playerTwo.id : gameObj.playerOne.id;
  const loserId = loserNum === 1 ? gameObj.playerOne.id : gameObj.playerTwo.id;
  const winnerSocket = retrieveSocket(winnerId);
  winnerSocket && winnerSocket.emit("winner", 1);
  const loserSocket = retrieveSocket(loserId);
  loserSocket && loserSocket.emit("loser", 1);
  removeGame(gameObj.gameId);
};

const isValidPiece = (
  pieceInfo: IPieceInfoObject,
  gameinfo: IGameInfo
): boolean => {
  let isValid = false;
  if (gameinfo.mandatoryMove.length < 1) return true;
  const pieceIndicators = indicatorLocations(
    pieceInfo,
    gameinfo.positions,
    gameinfo.turn,
    gameinfo.isFirst
  );
  for (const indicator of pieceIndicators) {
    for (const move of gameinfo.mandatoryMove) {
      if (
        arrayEqual(move.location, indicator.location) &&
        indicator.endangers
      ) {
        isValid = true;
      }
    }
  }
  return isValid;
};

export {
  isCorrectPlayer,
  takeTurn,
  playerNum,
  updateGameResualts,
  handleWin,
  checkeVictory,
  isValidPiece,
  handleTimer,
  validatePlayersTurn,
};
