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
  IGameObject,
  IndicatorInfo,
  IPieceInfoObject,
} from "../types/gameTypes";
import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId;

const playerNum = (gameObj: IGameObject, userId: string) => {
  if (gameObj.playerOne && gameObj.playerOne.id === userId) {
    return 1;
  }
  if (gameObj.playerTwo && gameObj.playerTwo.id === userId) {
    return 2;
  }
  return 0;
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
    console.log("selected piece is not of the current turns player");
    return false;
  }
  if (
    (gameObj.gameinfo.turn === colorOne &&
      gameObj.playerOne !== null &&
      gameObj.playerOne.id !== player) ||
    (gameObj.gameinfo.turn === colorTwo &&
      gameObj.playerTwo !== null &&
      gameObj.playerTwo.id !== player)
  ) {
    console.log("wrong user turn");
    return false;
  }
  return true;
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
    return;
  } else {
    gameObj.gameinfo.turn = oppositeColor(gameObj.gameinfo.turn);
    const mandatoryMoves = adjacentPieces(
      gameObj.gameinfo.positions,
      gameObj.gameinfo.turn
    );
    if (mandatoryMoves.length > 0) {
      gameObj.gameinfo.indicators = mandatoryMoves;
    } else {
      gameObj.gameinfo.indicators = [];
    }
    gameObj.gameinfo.selcetedPiece = null;
  }
};

const updateVictory = async (userId: string, opponentId: string) => {
  await User.updateOne(
    { _id: new ObjectId(userId) },
    { $push: { "checkersData.wins": opponentId } }
  );
};

const updateLose = async (userId: string, opponentId: string) => {
  await User.updateOne(
    { _id: new ObjectId(userId) },
    { $push: { "checkersData.loses": opponentId } }
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

export { isCorrectPlayer, takeTurn, playerNum, updateGameResualts };
