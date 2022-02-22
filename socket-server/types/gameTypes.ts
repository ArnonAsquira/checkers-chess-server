import Timer from "../gameLogic/timer/timer";

interface IGameObject {
  playerOne: { id: string; userName: string; timer: Timer } | null;
  playerTwo: { id: string; userName: string; timer: Timer } | null;
  gameId: string;
  gameinfo: IGameInfo;
}

interface IGameInfo {
  positions: IBoardPositions;
  turn: PlatyerColors;
  isFirst: boolean;
  selcetedPiece: IPieceInfoObject | null;
  mandatoryMove: IndicatorInfo[];
  indicators: IndicatorInfo[];
}

interface IParsedGameObject {
  playerOne: { userName: string; id?: string; time: number } | null;
  playerTwo: { userName: string; time: number } | null;
  gameId: string;
  gameinfo: IGameInfo;
}

interface IndicatorInfo {
  location: Location;
  endangers: Location | null;
}

type Location = [number, number];

interface IDiagonalSquares {
  rightDown: Location;
  rightUp: Location;
  leftDown: Location;
  leftUp: Location;
}

type IDiagonalSquaresKey = "rightDown" | "rightUp" | "leftDown" | "leftUp";

interface IPieceInfoObject {
  location: Location;
  isQueen: boolean;
}

interface IBoardPositions {
  red: IPieceInfoObject[];
  blue: IPieceInfoObject[];
}

interface ITurn {
  color: "red" | "blue";
  from: IPieceInfoObject;
  to: IPieceInfoObject;
}

type PlatyerColors = "red" | "blue";

export type {
  Location,
  IndicatorInfo,
  IDiagonalSquares,
  IBoardPositions,
  IPieceInfoObject,
  IDiagonalSquaresKey,
  ITurn,
  PlatyerColors,
  IGameObject,
  IGameInfo,
  IParsedGameObject,
};
