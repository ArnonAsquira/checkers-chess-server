interface IFunctionResponse {
  success: boolean;
  message: string;
  status: number;
}

interface IUserFromToken {
  userName: string;
  email: string;
  _id: string;
}

export type { IFunctionResponse, IUserFromToken };
