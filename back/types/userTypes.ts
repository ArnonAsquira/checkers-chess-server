export interface NewUser {
  password: string;
  email: string;
  userName: string;
}

export type BaseUser = Omit<NewUser, "userName">;

export interface UserFromDb {
  _id: string;
  userName: string;
  email: string;
  password: string;
  __v: number;
}

export type UserForToken = Pick<UserFromDb, "userName" | "email" | "_id">;
