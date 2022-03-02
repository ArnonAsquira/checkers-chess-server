import express, { json } from "express";
import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { authenticateToken } from "../middlewares/validateSchema";
import { User } from "../mongo/userSchema";
import { retrieveSocket } from "../socketLogic/socketArray";
import { playerNum, updateGameResualts } from "../socketLogic/utils";
import { IGameObject } from "../types/gameTypes";
import { IJoinGameBody, ILogoutBody } from "../types/requestBodyTypes";
import { IFunctionResponse } from "../types/routesTypes";
import { retrieveGameObject } from "../userManegement/gameHandeling";
import createGame from "./utils/gameUtils/createGame";
import joinGame from "./utils/gameUtils/joinGame";
import logOutOfGame from "./utils/gameUtils/logoutOfGame";
import parseGameObject from "./utils/gameUtils/parseGameObject";
const ObjectId = mongoose.Types.ObjectId;
const router = express();

router.get("/token", authenticateToken, (req, res) => {
  const gameToken = uuidv4();
  res.json({ gameToken });
});

router.post("/create", authenticateToken, async (req, res) => {
  const body = req.body;
  const userId = res.locals.user._id;
  if (typeof body.timer !== "number") {
    return res.status(403).send("you must provide a timer");
  }
  const userInfo = await User.findOne({ _id: new ObjectId(userId) });
  if (!userInfo) {
    const newGameObjectRes = await createGame(
      userId,
      res.locals.user.userName,
      "cool",
      body.timer
    );
    return res.status(newGameObjectRes.status).send(newGameObjectRes.message);
  }
  const newGameObjectRes = await createGame(
    userId,
    userInfo.userName,
    userInfo.styleCustomization.logo,
    body.timer
  );
  if (newGameObjectRes.status === 200) {
    return res.send(
      JSON.stringify(
        parseGameObject(JSON.parse(newGameObjectRes.message) as IGameObject)
      )
    );
  }
  return res.status(newGameObjectRes.status).send(newGameObjectRes.message);
});

router.post("/join", authenticateToken, async (req, res) => {
  const body: IJoinGameBody = req.body;
  if (typeof body.gameToken !== "string" || typeof body.userId !== "string")
    return res.status(403).send("bad request body");
  const userId = res.locals.user._id;
  const userName = res.locals.user.userName;
  const userCustomization = await User.findOne(
    { _id: new ObjectId(userId) },
    { "styleCustomization.logo": 1 }
  );
  const userLogo = userCustomization
    ? userCustomization.styleCustomization.logo
    : null;
  const joinedGameResponse = joinGame(
    body.gameToken,
    userId,
    userName,
    userLogo
  );
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

router.post("/invite", authenticateToken, async (req, res) => {
  const body = req.body;
  if (!body.gameToken || !body.userEmail) {
    return res.status(403).send("request must contain userEmail and gameToken");
  }
  const inviteeInfo = await User.findOne({ email: body.userEmail });
  if (!inviteeInfo) {
    return res.status(403).send("user does not exist");
  }
  const inviteeSocket = retrieveSocket(inviteeInfo._id.toString());
  if (!inviteeSocket) {
    return res.status(404).send("user not connected");
  }
  inviteeSocket.emit("invited", body.gameToken, res.locals.user.userName);
  return res.send("invitation sent");
});

export default router;
