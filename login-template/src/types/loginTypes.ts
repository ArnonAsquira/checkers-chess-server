import { SignUpValues } from "./signUpTypes";

type LoginValues = Omit<SignUpValues, "userName">;

export type { LoginValues };
