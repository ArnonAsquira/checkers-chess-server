import { IFunctionResponse } from "../../../types/routesTypes";

const makeFucntionResponse = (
  success: boolean,
  message: string,
  status: number
): IFunctionResponse => ({
  success,
  message,
  status,
});

export default makeFucntionResponse;
