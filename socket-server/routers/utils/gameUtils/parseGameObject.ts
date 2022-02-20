import { IGameObject, IParsedGameObject } from "../../../types/gameTypes";

const parseGameObject = (gameObj: IGameObject): IParsedGameObject => {
  const playerOneData =
    gameObj.playerOne == null
      ? null
      : gameObj.playerTwo === null
      ? gameObj.playerOne
      : { userName: gameObj.playerOne.userName };
  const playerTwoData =
    gameObj.playerTwo == null ? null : { userName: gameObj.playerTwo.userName };
  return {
    ...gameObj,
    playerOne: playerOneData,
    playerTwo: playerTwoData,
  };
};

export default parseGameObject;
