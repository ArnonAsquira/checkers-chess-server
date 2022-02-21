import express, { json } from "express";
import { v4 as uuidv4 } from "uuid";
import { authenticateToken } from "../middlewares/validateSchema";
import { retrieveSocket } from "../socketLogic/socketArray";
import { playerNum, updateGameResualts } from "../socketLogic/utils";
import { IGameObject } from "../types/gameTypes";
import { IJoinGameBody, ILogoutBody } from "../types/requestBodyTypes";
import { IFunctionResponse } from "../types/routesTypes";
import {
  pushGameToArray,
  retrieveGameObject,
} from "../userManegement/gameHandeling";
import joinGame from "./utils/gameUtils/joinGame";
import logOutOfGame from "./utils/gameUtils/logoutOfGame";
import parseGameObject from "./utils/gameUtils/parseGameObject";
const router = express();

router.get("/token", authenticateToken, (req, res) => {
  const gameToken = uuidv4();
  res.json({ gameToken });
});

router.post("/join", authenticateToken, (req, res) => {
  const body: IJoinGameBody = req.body;
  if (typeof body.gameToken !== "string" || typeof body.userId !== "string")
    return res.status(403).send("bad request body");
  const userId = res.locals.user._id;
  const userName = res.locals.user.userName;
  const joinedGameResponse = joinGame(body.gameToken, userId, userName);
  if (joinedGameResponse.status === 200) {
    return res.send(
      JSON.stringify(
        parseGameObject(JSON.parse(joinedGameResponse.message) as IGameObject)
      )
    );
  }
  res.status(joinedGameResponse.status).send(joinedGameResponse.message);
});

router.post("/logout", authenticateToken, (req, res) => {
  const body: ILogoutBody = req.body;
  const gameObj = retrieveGameObject(body.gameToken);
  if (gameObj === undefined) {
    return res.status(403).send("game does not exist");
  }
  const playerNumber = playerNum(gameObj, body.userId);
  updateGameResualts(playerNumber, gameObj);
  const logOutResponse: IFunctionResponse = logOutOfGame(
    gameObj,
    body.userId,
    body.gameToken
  );
  const socket = retrieveSocket(body.userId);
  if (socket) {
    socket.to(body.gameToken).emit("player disconnected", playerNumber);
  }
  return res.status(logOutResponse.status).send(logOutResponse.message);
});

export default router;
