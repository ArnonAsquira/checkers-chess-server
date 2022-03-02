import { v4 as uuidv4 } from "uuid";
import createNewGame from "../../../gameLogic/gameUtils/createNewGame";
import { IGameObject } from "../../../types/gameTypes";
import Timer from "../../../gameLogic/timer/timer";
import { pushGameToArray } from "../../../userManegement/gameHandeling";
import makeFucntionResponse from "../generalUtils/functionResponse";

const createGame = async (
  userId: string,
  userName: string,
  userLogo: string,
  timer: number
) => {
  const gameToken = uuidv4().slice(0, 10);
  const newGameInfo = createNewGame();
  const newGameObj: IGameObject = {
    playerOne: {
      id: userId,
      userName,
      timer: new Timer(timer),
      logo: userLogo,
    },
    playerTwo: null,
    gameId: gameToken,
    gameinfo: newGameInfo,
    initialTimer: timer,
  };
  const pushSucceded = pushGameToArray(newGameObj);
  if (pushSucceded) {
    return makeFucntionResponse(true, JSON.stringify(newGameObj), 200);
  }
  return makeFucntionResponse(false, "failed to create game", 500);
};

export default createGame;
