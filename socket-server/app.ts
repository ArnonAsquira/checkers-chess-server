import express from "express";
import cors from "cors";
import gameRouters from "./routers/gameRouters";
import jwtAccesRouter from "./routers/jwtAccessRouter";
import mongoose from "mongoose";
import * as config from "./utils/environmentVars";

const app = express();

mongoose.connect(config.MONGO_URI);

app.use(cors());
app.use(express.json());

app.use("/game", gameRouters);

app.use("/jwtaccess", jwtAccesRouter);

export default app;
