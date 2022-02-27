import { IGameObject, IParsedGameObject } from "../../../types/gameTypes";

const parseGameObject = (gameObj: IGameObject): IParsedGameObject => {
  const playerOneData =
    gameObj.playerOne === null
      ? null
      : gameObj.playerTwo === null
      ? { ...gameObj.playerOne, time: gameObj.playerOne.timer.time }
      : {
          userName: gameObj.playerOne.userName,
          time: gameObj.playerOne.timer.time,
        };
  const playerTwoData =
    gameObj.playerTwo == null
      ? null
      : {
          userName: gameObj.playerTwo.userName,
          time: gameObj.playerTwo.timer.time,
        };
  return {
    ...gameObj,
    playerOne: playerOneData,
    playerTwo: playerTwoData,
  };
};

export default parseGameObject;
