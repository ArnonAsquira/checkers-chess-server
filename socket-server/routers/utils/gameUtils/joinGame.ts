import { retrieveGameObject } from "../../../userManegement/gameHandeling";
import makeFucntionResponse from "../generalUtils/functionResponse";
import { IFunctionResponse } from "../../../types/routesTypes";
import Timer from "../../../gameLogic/timer/timer";

const joinGame = (
  gameToken: string,
  userId: string,
  userName: string,
  userLogo: string | null
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
    gameobj.playerTwo = {
      id: userId,
      userName,
      timer: new Timer(gameobj.initialTimer),
      logo: userLogo,
    };
    return makeFucntionResponse(true, JSON.stringify(gameobj), 200);
  } else {
    return makeFucntionResponse(false, "game does not exist", 404);
  }
};

export default joinGame;
