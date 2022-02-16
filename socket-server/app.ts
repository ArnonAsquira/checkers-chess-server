import express from "express";
import cors from "cors";
import { port } from "./constants";
import gameRouters from "./routers/gameRouters";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/game", gameRouters);
export default app;
