import express from "express";
import jwt from "jsonwebtoken";
import { validateUser } from "../middlewares/validateSchema";
import { RefreshTokens } from "../mongo/refreshTokensSchmea";
import { generateAccesToken } from "../utils/jwtFunction";
import { UserForToken } from "../types/userTypes";
import { SECRET } from "../utils/enviormentVars";
const Router = express();

const secret = SECRET;

Router.post("/", validateUser, async (_req, res, next) => {
  try {
    const user: UserForToken = {
      email: res.locals.user.email,
      userName: res.locals.user.userName,
    };
    const accessToken = generateAccesToken(user, secret);
    const newRefreshToken = new RefreshTokens({
      token: jwt.sign(user, secret),
    });
    newRefreshToken.save();
    return res.send({ token: `jwt=${accessToken}` });
  } catch (err) {
    next(err);
  }
});

export default Router;
