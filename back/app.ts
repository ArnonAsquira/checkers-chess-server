import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import signUpRouter from "./routers/signUpRouter";
import loginRouter from "./routers/loginRouter";
import { errorHandler } from "./middlewares/errorHandelingMiddleware";
import cookieParser from "cookie-parser";
import { authenticateToken } from "./middlewares/validateSchema";
import * as config from "./utils/enviormentVars";
const app = express();
console.log(config.MONGO_URL);
mongoose.connect(config.MONGO_URL);

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.get("/", authenticateToken, (_req, res) => {
  res.send({ recognize: true });
});

app.use("/signup", signUpRouter);

app.use("/login", loginRouter);

app.use(errorHandler);

export default app;
