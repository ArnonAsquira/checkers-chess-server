import { colorOne, colorTwo } from "../gameLogic/constants";
import indicatorLocations from "../gameLogic/gameUtils/calcIndicators";
import { adjacentPieces } from "../gameLogic/gameUtils/calcMandatoryPieces";
import updatePositions from "../gameLogic/gameUtils/updatePosition";
import arrayEqual, {
  arrayIncludes,
} from "../gameLogic/generalUtils/arrayEqual";
import oppositeColor from "../gameLogic/generalUtils/oppositeColor";
import {
  IBoardPositions,
  IGameInfo,
  IGameObject,
  IndicatorInfo,
  IPieceInfoObject,
} from "../types/gameTypes";

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
  if (
    (gameObj.gameinfo.turn === colorOne && gameObj.playerOne !== player) ||
    (gameObj.gameinfo.turn === colorTwo && gameObj.playerTwo !== player)
  ) {
    return false;
  }
  return true;
};

const takeTurn = (indicator: IndicatorInfo, gameObj: IGameObject) => {
  if (gameObj.gameinfo.selcetedPiece === null) {
    return console.log("no piece selceted");
  }
  const newPositions = updatePositions(
    gameObj.gameinfo.turn,
    gameObj.gameinfo.selcetedPiece,
    indicator,
    gameObj.gameinfo.positions
  );
  gameObj.gameinfo.positions = newPositions;
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
  if (consecutiveDangerIndicators.length > 0) {
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

export { isCorrectPlayer, takeTurn };
