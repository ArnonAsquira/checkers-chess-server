import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { User } from "../mongo/userSchema";
import { RequestHandler } from "express";
import { UserFromDb } from "../types/userTypes";
import { isUser, isNewUser } from "./predicators.ts/predicateUser";
import * as config from "../utils/enviormentVars";

const secret = config.SECRET;

export const validateBodySchema: RequestHandler = (req, res, next) => {
  const body = req.body;
  if (!isUser(body)) return res.status(403).send("invalid user object");
  next();
};

export const validateExistingUser: RequestHandler = async (req, res, next) => {
  const body = req.body;
  if (!isNewUser(body)) return res.status(403).send("invalid user object");
  const isExistingUser: UserFromDb | null = await User.findOne({
    email: body.email,
  });
  const existingUserNmae: UserFromDb | null = await User.findOne({
    userName: body.userName,
  });
  if (isExistingUser !== null)
    return res.status(409).send("user already exists");
  if (existingUserNmae !== null) return res.status(409).send("userName taken");
  next();
};

export const validateUser: RequestHandler = async (req, res, next) => {
  const body = req.body;
  if (!isUser(body)) return res.status(403).send("invalid user object");
  const user: UserFromDb | undefined = await User.findOne({
    email: body.email,
  });
  if (user === null) return res.status(404).send("cannot find user");
  bcrypt.compare(body.password, user.password, function (err, response) {
    if (err) {
      console.log(err);
      return res.status(403).send("User or Password incorrect");
    }
    if (response) {
      res.locals.user = user;
      return next();
    } else {
      return res.status(403).send("User or Password incorrect");
    }
  });
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
