import * as jwt from "jsonwebtoken";
import { RequestHandler } from "express";
import * as config from "../utils/environmentVars";
import { IUserFromToken } from "../types/routesTypes";

const secret: string = config.SECRET;

const authenticateTokenFunc = (token: string): IUserFromToken | false => {
  try {
    const parsedToken = token.split(" ")[1];
    let initialUser: undefined | IUserFromToken;
    jwt.verify(parsedToken, secret, (err, user) => {
      if (err) {
        throw err;
      }
      initialUser = user as IUserFromToken;
    });
    return initialUser as IUserFromToken;
  } catch (err) {
    console.log(err);
    return false;
  }
};

export const authenticateToken: RequestHandler = (req, res, next) => {
  const accessToken =
    req.headers.authorization && req.headers.authorization.split(" ")[1];
  if (!accessToken) return res.status(401).send("Access Token Required");
  jwt.verify(accessToken, secret, (err, user) => {
    if (err) return res.status(403).send("Invalid Access Token");
    res.locals.user = user;
    next();
  });
};

export { authenticateTokenFunc };
