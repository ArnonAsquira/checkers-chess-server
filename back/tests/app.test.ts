import request from "supertest";
import app from "../app";
import { User } from "../mongo/userSchema";
import { BaseUser } from "../types/userTypes";

const createUser = async (user: any) =>
  await request(app).post("/signup").send(user);

const testUser = {
  email: "test@gmail.com",
  userName: "testUser",
  password: "123",
};

describe("POST /signup", () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  const invalidUser = {
    email: "13123131",
  };

  describe("given a legitimate body", () => {
    test("should respond with status code 200", async () => {
      const response = await createUser(testUser);
      expect(response.statusCode).toBe(200);
    });
    test("should create a new user", async () => {
      const users = await User.find({});
      await createUser(testUser);
      const newUsers = await User.find({});
      const newUser = await User.findOne({ userName: testUser.userName });
      expect(newUsers.length).toBe(users.length + 1);
      expect(newUser).not.toBe(null);
    });
  });

  describe("signing up a nonlegitimate user", () => {
    let response: request.Response;
    beforeAll(async () => {
      response = await createUser(invalidUser);
    });
    test("should not create a new user in the database", async () => {
      const user = await User.findOne({ email: invalidUser.email });
      expect(user).toBe(null);
    });
    test("should respond with status code 403", async () => {
      expect(response.statusCode).toBe(403);
    });
    test("should resault in the correct message", async () => {
      expect(response.text).toBe("invalid user object");
    });
  });
});

describe("POST /login", () => {
  beforeAll(async () => {
    await createUser(testUser);
  });

  const logUser = async (user: BaseUser) =>
    await request(app).post("/login").send(user);

  const correctUser = {
    email: testUser.email,
    password: testUser.password,
  };

  describe("logging in with the correct information", () => {
    test("should resault in the correct message", async () => {
      const response = await logUser(correctUser);
      expect(response.statusCode).toBe(200);
      expect(JSON.parse(response.text).token).toBeTruthy();
    });
  });
});
