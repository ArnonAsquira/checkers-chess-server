import express from "express";
import cors from "cors";
import gameRouters from "./routers/gameRouters";
import jwtAccesRouter from "./routers/jwtAccessRouter";
const app = express();

app.use(cors());
app.use(express.json());

app.use("/game", gameRouters);

app.use("/jwtaccess", jwtAccesRouter);

export default app;
