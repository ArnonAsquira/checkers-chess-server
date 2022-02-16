import express from "express";
import { v4 as uuidv4 } from "uuid";
import { IGameObject } from "../types/gameTypes";
import { IJoinGameBody } from "../types/requestBodyTypes";
import {
  pushGameToArray,
  retrieveGameObject,
} from "../userManegement/gameHandeling";
const router = express();

router.get("/token", (req, res) => {
  const gameToken = uuidv4();
  res.json({ gameToken });
});

router.post("/join", (req, res) => {
  const body: IJoinGameBody = req.body;
  console.log(body);
  if (!body.gameToken || !body.userId) {
    return res.status(403).send("invalid body");
  }
  const gameobj = retrieveGameObject(body.gameToken);
  console.log(gameobj);
  if (gameobj) {
    if (gameobj.playerTwo !== null) {
      return res.status(403).send("game is already full");
    }
    gameobj.playerTwo = body.userId;
    return res.json({ player: "two", gameId: body.gameToken });
  }
  const newGameObj: IGameObject = {
    playerOne: body.userId,
    playerTwo: null,
    gameId: body.gameToken,
  };
  const pushSucceded = pushGameToArray(newGameObj);
  if (pushSucceded) {
    return res.send("new game created");
  }
  return res.status(500).send("failed to create new game");
});

export default router;
