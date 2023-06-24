import "../../loadEnvironment.js";
import { MongoMemoryServer } from "mongodb-memory-server";
import connectToDatabase from "../../database/connectToDatabase.js";
import mongoose from "mongoose";
import User from "../../database/models/User.js";
import { type UserDataStructure, type UserCredentials } from "../types.js";
import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../index.js";

let server: MongoMemoryServer;

beforeAll(async () => {
  server = await MongoMemoryServer.create();
  await connectToDatabase(server.getUri());
});

afterAll(async () => {
  await mongoose.connection.close();
  await server.stop();
});

afterEach(async () => {
  await User.deleteMany();
});

const mockedUserValidCredentials: UserCredentials = {
  username: "ari",
  password: "ari",
};

const mockedUserInvalidValidCredentials: UserCredentials = {
  username: "ar",
  password: "ar",
};

const mockUserHashed: UserDataStructure = {
  name: "Ari",
  username: "ari",
  password: "$2y$10$z.kqadF5mKlVXGvLs0UP6.gDqzbnys2BwGazQYDLaBDB5S9EPmzw2",
};

const mockUserInvalidLogin = {
  username: "ari",
  password: 123,
};

describe("Given a POST user/login endpoint", () => {
  describe("When it receives a request with username: ari and password: ari", () => {
    beforeEach(async () => {
      await User.create(mockUserHashed);
    });
    test("Then it should respond with status code 200 and a token", async () => {
      const expectedStatusCode = 200;

      const newUser = await User.findOne({
        username: mockedUserValidCredentials.username,
      });

      const response = await request(app)
        .post("/user/login")
        .send(mockedUserValidCredentials)
        .expect(expectedStatusCode);

      const tokenPayload = jwt.verify(
        response.body.token as string,
        process.env.JWT_SECRET!
      );

      const userId = tokenPayload.sub;

      expect(userId).toEqual(newUser?._id.toString());
    });
  });

  describe("When it receives a request with invalidi credentials username 'ar' and password 'ar'", () => {
    test("Then it should respond a status 401 and message 'Wrong credential'", async () => {
      const expectedStatus = 401;
      const expectedMessage = "Wrong credential";

      const response = await request(app)
        .post("/user/login")
        .send(mockedUserInvalidValidCredentials)
        .expect(expectedStatus);

      expect(response.body.message).toBe(expectedMessage);
    });
  });

  describe("When it receives a request with invalid format credentials username 'ari' and password 123", () => {
    test("Then it should respond with status 400 and message 'Validation Failed' ", async () => {
      const expectedStatus = 400;
      const expectedMessage = "Validation Failed";

      const response = await request(app)
        .post("/user/login")
        .send(mockUserInvalidLogin)
        .expect(expectedStatus);

      expect(response.body.message).toBe(expectedMessage);
    });
  });
});
