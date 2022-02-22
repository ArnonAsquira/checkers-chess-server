import { IGameInfo, IGameObject } from "../../types/gameTypes";
import { initialPositions } from "./createBoard";

const createNewGame = (): IGameInfo => {
  const positions = initialPositions();
  return {
    positions,
    turn: "red",
    isFirst: true,
    selcetedPiece: null,
    indicators: [],
    mandatoryMove: [],
  };
};

export default createNewGame;
