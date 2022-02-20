import express from "express";
import jwt from "jsonwebtoken";
import { validateUser } from "../middlewares/validateSchema";
import { RefreshTokens } from "../mongo/refreshTokensSchmea";
import { generateAccesToken } from "../utils/jwtFunction";
import { UserForToken } from "../types/userTypes";
import { SECRET } from "../utils/enviormentVars";
import { v4 as uuidv4 } from "uuid";
import { isUser } from "../middlewares/predicators.ts/predicateUser";
const Router = express();

const secret = SECRET;

Router.post("/", validateUser, async (_req, res, next) => {
  try {
    const user: UserForToken = {
      email: res.locals.user.email,
      userName: res.locals.user.userName,
      _id: res.locals.user._id,
    };
    const accessToken = generateAccesToken(user, secret);
    // const newRefreshToken = new RefreshTokens({
    //   token: jwt.sign(user, secret),
    // });
    // newRefreshToken.save();
    return res.send({ token: `jwt=${accessToken}`, id: user._id });
  } catch (err) {
    next(err);
  }
});

Router.post("/guest", (req, res, next) => {
  try {
    const guestDetails = uuidv4();
    const newGuest = {
      userName: guestDetails,
      email: guestDetails,
      _id: guestDetails,
    };
    const accessToken = generateAccesToken(newGuest, secret);
    return res.send({ token: `jwt=${accessToken}`, id: newGuest._id });
  } catch (err) {
    next(err);
  }
});

export default Router;
