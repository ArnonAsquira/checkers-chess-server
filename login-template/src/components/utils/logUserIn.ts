import { deleteAllCookies } from "./deleteAllCookies";
import axios from "axios";
import Swal from "sweetalert2";
import { LoginValues } from "../../types/loginTypes";
import validateErr from "./extractErrorText";

export async function loginUserIn(
  baseUrl: string,
  inputValues: LoginValues
): Promise<string | false> {
  deleteAllCookies();
  try {
    const { data }: { data: string } = await axios.post(
      `${baseUrl}/login`,
      inputValues
    );
    document.cookie = data;
    Swal.fire("logged in successfuly");
    return data;
  } catch (err: any) {
    const loginError = validateErr(err);
    Swal.fire(loginError.text);
    return false;
  }
}
