import * as dotenv from "dotenv";
dotenv.config();

const MONGO_URL: string =
  process.env.NODE_ENV === "test"
    ? process.env.MONGO_URL_TEST || "no mongo uri"
    : process.env.MONGO_URL || "no mongo uri";

const SECRET = process.env.SECRET;

export { MONGO_URL, SECRET };
