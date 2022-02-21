interface IJoinGameBody {
  userId: string;
  gameToken: string;
}
type ILogoutBody = IJoinGameBody;

export type { IJoinGameBody, ILogoutBody };
