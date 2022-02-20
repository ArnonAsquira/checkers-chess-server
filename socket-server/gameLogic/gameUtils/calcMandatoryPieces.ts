import {
  IBoardPositions,
  IndicatorInfo,
  PlatyerColors,
} from "../../types/gameTypes";
import { arrayIncludes } from "../generalUtils/arrayEqual";
import indicatorLocations from "./calcIndicators";

const adjacentPieces = (positions: IBoardPositions, turn: PlatyerColors) => {
  const allIndicators: IndicatorInfo[] = [];
  positions[turn].forEach((info) => {
    allIndicators.push(...indicatorLocations(info, positions, turn, true));
  });
  const uniqueIndicators: IndicatorInfo[] = allIndicators.filter(
    (info) => info.endangers
  );
  for (let i = 0; i < allIndicators.length; i++) {
    if (
      !arrayIncludes(
        allIndicators[i].location,
        uniqueIndicators.map((info) => info.location)
      )
    ) {
      uniqueIndicators.push(allIndicators[i]);
    }
  }
  return uniqueIndicators.filter((info) => info.endangers);
};

export { adjacentPieces };
