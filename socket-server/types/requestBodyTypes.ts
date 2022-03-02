interface IJoinGameBody {
  userId: string;
  gameToken: string;
}
type ILogoutBody = IJoinGameBody;

interface ICreateGame {
  timer: number;
}

export type { IJoinGameBody, ILogoutBody };
