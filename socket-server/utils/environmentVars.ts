import "dotenv/config";

const SECRET: string =
  process.env.SECRET === undefined ? "123" : process.env.SECRET;

const MONGO_URI: string =
  process.env.MONGO_URL === undefined ? "123" : process.env.MONGO_URL;

export { SECRET, MONGO_URI };
