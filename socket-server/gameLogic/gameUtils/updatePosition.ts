import { colorOne, colorTwo } from "../constants";
import {
  Location,
  PlatyerColors,
  IndicatorInfo,
  IBoardPositions,
  IPieceInfoObject,
} from "../../types/gameTypes";
import arrayEqual from "../generalUtils/arrayEqual";
import oppositeColor from "../generalUtils/oppositeColor";

const filterdLocation = (
  locationArray: IPieceInfoObject[],
  removeLocation: Location
): IPieceInfoObject[] => {
  return locationArray.filter(
    (pieceInfo) => !arrayEqual(pieceInfo.location, removeLocation)
  );
};

const updatePositions = (
  pieceColor: PlatyerColors,
  selectedPiece: IPieceInfoObject,
  indcator: IndicatorInfo,
  boardPosition: IBoardPositions
): IBoardPositions => {
  const reachedEndOfBoard =
    pieceColor === colorOne
      ? indcator.location[0] === 7
      : indcator.location[0] === 0;
  const oppColor = oppositeColor(pieceColor);
  const newPositions = {
    ...boardPosition,
    [pieceColor]: filterdLocation(
      boardPosition[pieceColor],
      selectedPiece.location
    ).concat({
      location: indcator.location,
      isQueen: selectedPiece.isQueen || reachedEndOfBoard,
    }),
    [oppColor]:
      indcator.endangers === null
        ? boardPosition[oppColor]
        : filterdLocation(boardPosition[oppColor], indcator.endangers),
  };

  return newPositions;
};

export default updatePositions;
