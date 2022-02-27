import {
  retrieveGameObject,
  pushGameToArray,
} from "../../../userManegement/gameHandeling";
import { IGameObject } from "../../../types/gameTypes";
import makeFucntionResponse from "../generalUtils/functionResponse";
import { IFunctionResponse } from "../../../types/routesTypes";
import createNewGame from "../../../gameLogic/gameUtils/createNewGame";
import Timer from "../../../gameLogic/timer/timer";

const joinGame = (
  gameToken: string,
  userId: string,
  userName: string
): IFunctionResponse => {
  const gameobj = retrieveGameObject(gameToken);
  if (gameobj) {
    if (gameobj.playerTwo !== null) {
      return makeFucntionResponse(false, "game full", 403);
    }
    if (gameobj.playerOne && gameobj.playerOne.id === userId) {
      return makeFucntionResponse(
        false,
        "you cant join the same game twice",
        403
      );
    }
    gameobj.playerTwo = { id: userId, userName, timer: new Timer(600) };
    return makeFucntionResponse(true, JSON.stringify(gameobj), 200);
  }
  const newGameInfo = createNewGame();
  const newGameObj: IGameObject = {
    playerOne: { id: userId, userName, timer: new Timer(600) },
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
