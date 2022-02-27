import { IGameObject } from "../../../types/gameTypes";
import {
  removeGame,
  retrieveGameObject,
} from "../../../userManegement/gameHandeling";
import makeFucntionResponse from "../generalUtils/functionResponse";

const logOutOfGame = (gameObj: IGameObject, userId: string, gameId: string) => {
  if (gameObj.playerOne !== null && gameObj.playerTwo !== null) {
    removeGame(gameId);
    return makeFucntionResponse(true, `${userId} has lost the game`, 200);
  }
  removeGame(gameId);
  return makeFucntionResponse(true, `the game was removed`, 200);
};

export default logOutOfGame;
