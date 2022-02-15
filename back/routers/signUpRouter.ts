import express from "express";
import bcrypt from "bcrypt";
import { User } from "../mongo/userSchema";
import {
  validateBodySchema,
  validateExistingUser,
} from "../middlewares/validateSchema";
const Router = express();

Router.post(
  "/",
  validateBodySchema,
  validateExistingUser,
  async (req, res, next) => {
    const body = req.body;
    try {
      const hashPassword = await bcrypt.hash(body.password, 10);
      const newUser = new User({
        userName: body.userName,
        email: body.email,
        password: hashPassword,
      });
      newUser.save();
      return res.send({ updated: true });
    } catch (err) {
      next(err);
    }
  }
);

export default Router;
