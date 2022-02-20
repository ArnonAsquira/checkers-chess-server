import express, { json } from "express";
import { v4 as uuidv4 } from "uuid";
import { authenticateToken } from "../middlewares/validateSchema";
import { IGameObject } from "../types/gameTypes";
import { IJoinGameBody } from "../types/requestBodyTypes";
import {
  pushGameToArray,
  retrieveGameObject,
} from "../userManegement/gameHandeling";
import joinGame from "./utils/gameUtils/joinGame";
import parseGameObject from "./utils/gameUtils/parseGameObject";
const router = express();

router.get("/token", authenticateToken, (req, res) => {
  const gameToken = uuidv4();
  res.json({ gameToken });
});

router.post("/join", authenticateToken, (req, res) => {
  const body: IJoinGameBody = req.body;
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

export default router;
