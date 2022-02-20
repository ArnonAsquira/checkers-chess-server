import {
  retrieveGameObject,
  pushGameToArray,
} from "../../../userManegement/gameHandeling";
import { IGameObject } from "../../../types/gameTypes";
import makeFucntionResponse from "../generalUtils/functionResponse";
import { IFunctionResponse } from "../../../types/routesTypes";
import createNewGame from "../../../gameLogic/gameUtils/createNewGame";

const joinGame = (gameToken: string, userId: string): IFunctionResponse => {
  const gameobj = retrieveGameObject(gameToken);
  if (gameobj) {
    if (gameobj.playerTwo !== null) {
      return makeFucntionResponse(false, "game full", 403);
    }
    gameobj.playerTwo = userId;
    return makeFucntionResponse(true, JSON.stringify(gameobj), 200);
  }
  const newGameInfo = createNewGame();
  console.log(userId);
  const newGameObj: IGameObject = {
    playerOne: userId,
    playerTwo: null,
    gameId: gameToken,
    gameinfo: newGameInfo,
  };
  const pushSucceded = pushGameToArray(newGameObj);
  if (pushSucceded) {
    return makeFucntionResponse(true, JSON.stringify(newGameObj), 200);
  }
  return makeFucntionResponse(false, "failed to create game", 500);
};

export default joinGame;
