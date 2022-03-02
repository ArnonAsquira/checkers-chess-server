import { IGameObject } from "../../../types/gameTypes";
import { removeGame } from "../../../userManegement/gameHandeling";
import makeFucntionResponse from "../generalUtils/functionResponse";
import { retrieveSocket } from "../../../socketLogic/socketArray";

const logOutOfGame = (gameObj: IGameObject, userId: string, gameId: string) => {
  const userSocket = retrieveSocket(userId);
  userSocket && userSocket.leave(gameId);
  if (gameObj.playerOne !== null && gameObj.playerTwo !== null) {
    removeGame(gameId);
    return makeFucntionResponse(true, `${userId} has lost the game`, 200);
  }
  removeGame(gameId);
  return makeFucntionResponse(true, `the game was removed`, 200);
};

export default logOutOfGame;
