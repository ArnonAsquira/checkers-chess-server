import * as jwt from "jsonwebtoken";
import { UserForToken } from "../types/userTypes";

export function generateAccesToken(user: UserForToken, secret: string) {
  return jwt.sign(user, secret, { expiresIn: "2h" });
}
