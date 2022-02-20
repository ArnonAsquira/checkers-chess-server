import express from "express";
import { authenticateToken } from "../middlewares/validateSchema";
import { IUserFromToken } from "../types/routesTypes";
const router = express();

router.get("/", authenticateToken, (req, res) => {
  const user: IUserFromToken = res.locals.user;
  return res.send({ autenitcated: true, userId: user._id });
});

export default router;
