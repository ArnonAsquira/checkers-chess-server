import * as dotenv from "dotenv";
dotenv.config({ path: __dirname + "/.env" });

const SECRET: string = process.env.SECRET || "123";

export { SECRET };
