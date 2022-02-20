import express from "express";
import { v4 as uuidv4 } from "uuid";
import { authenticateToken } from "../middlewares/validateSchema";
import { IGameObject } from "../types/gameTypes";
import { IJoinGameBody } from "../types/requestBodyTypes";
import {
  pushGameToArray,
  retrieveGameObject,
} from "../userManegement/gameHandeling";
import joinGame from "./utils/gameUtils/joinGame";
const router = express();

router.get("/token", (req, res) => {
  const gameToken = uuidv4();
  res.json({ gameToken });
});

router.post("/join", authenticateToken, (req, res) => {
  const body: IJoinGameBody = req.body;
  const userId = res.locals.user._id;
  const joinedGameResponse = joinGame(body.gameToken, userId);
  res.status(joinedGameResponse.status).send(joinedGameResponse.message);
});

export default router;
