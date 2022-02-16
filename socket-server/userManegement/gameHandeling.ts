import { IGameObject } from "../types/gameTypes";

const currentGames: IGameObject[] = [];

const getCurrentGames = () => {
  return currentGames;
};

const pushGameToArray = (game: IGameObject): boolean => {
  const gameIndex = currentGames.findIndex(
    (gameObj) => gameObj.gameId === game.gameId
  );
  if (gameIndex !== -1) {
    return false;
  }
  currentGames.push(game);
  return true;
};

const removeGame = (gameToken: string): boolean => {
  const gameIndex = currentGames.findIndex(
    (gameObj) => gameObj.gameId === gameToken
  );
  if (gameIndex === -1) {
    return false;
  }
  currentGames.splice(gameIndex, 1);
  return true;
};
// const updateGames = (gameToken: string) => {};

const retrieveGameObject = (gameToken: string): IGameObject | undefined => {
  return currentGames.find((gameObj) => gameObj.gameId === gameToken);
};

export { getCurrentGames, retrieveGameObject, pushGameToArray, removeGame };
