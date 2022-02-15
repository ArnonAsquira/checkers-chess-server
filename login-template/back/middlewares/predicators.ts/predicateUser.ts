import { BaseUser, NewUser } from "../../types/userTypes";

export function isUser(user: any): user is BaseUser {
  if (typeof user.email !== "string" || typeof user.password !== "string") {
    return false;
  }
  return true;
}

export function isNewUser(user: any): user is NewUser {
  if (
    typeof user.userName !== "string" ||
    typeof user.password !== "string" ||
    typeof user.userName !== "string"
  ) {
    return false;
  }
  return true;
}
