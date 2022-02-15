import validator from "validator";
import Swal from "sweetalert2";
import axios from "axios";
import { SignUpValues } from "../../types/signUpTypes";
import validateErr from "./extractErrorText";

function validateInputs(inputValues: SignUpValues) {
  if (!inputValues.userName) {
    alert("please enter a user name");
    return false;
  }
  if (!validator.isEmail(inputValues.email)) {
    alert("email is not valid");
    return false;
  }
  if (!validator.isStrongPassword(inputValues.password)) {
    alert("weak password please selecet another one");
    return false;
  }
  return true;
}

export async function signUserUp(
  baseUrl: string,
  inputValues: SignUpValues
): Promise<boolean> {
  if (!validateInputs(inputValues)) return false;
  try {
    const { data } = await axios.post(`${baseUrl}/signup`, inputValues);
    Swal.fire("user created");
    if (data.updated) return true;
    return false;
  } catch (err: any) {
    const errText = validateErr(err);
    Swal.fire(errText.text);
    return false;
  }
}
