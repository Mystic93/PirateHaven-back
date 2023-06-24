import "../../../loadEnvironment.js";
import { MongoMemoryServer } from "mongodb-memory-server";
import connectToDatabase from "../../../database/connectToDatabase.js";
import mongoose from "mongoose";
import Pirate from "../../../database/models/Pirate.js";
import {
  type PirateStructure,
  piratesMock,
  luffyMock,
} from "../../../mocks/piratesMock.js";
import request from "supertest";
import app from "../../index.js";
import { type UserCredentials } from "../../types.js";

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
  await Pirate.deleteMany();
});

beforeEach(() => {
  jest.clearAllMocks();
});

export const invalidTokenMock: UserCredentials = {
  username: "wrongAdmin",
  password: "asdad",
};

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NDcwNjZhMjdmYmYyZmFmMDZmOWY0Y2EiLCJpYXQiOjE2ODYzOTI0NDEsImV4cCI6MTcxMjMxMjQ0MX0.K78cQpCIagRcj5TNS0II4Jfy5SGOSRZS5FVf3vHZmkM";

describe("Given a GET '/pirates' endpoint", () => {
  describe("When it receives a request", () => {
    beforeEach(async () => {
      await Pirate.create(piratesMock);
    });
    test("Then it should response with status code 200 and a list of pirates", async () => {
      const expectedStatusCode = 200;

      const response: { body: PirateStructure[] } = await request(app)
        .get("/pirates")
        .expect(expectedStatusCode);

      expect(response.body).toHaveLength(piratesMock.length);
    });
  });
});

describe("Given a DELETE '/pirates' endpoint", () => {
  beforeEach(async () => {
    await Pirate.create(piratesMock[0]);
  });

  describe("When it receive a request with valid authorization ", () => {
    test("Then it should response with status code 200 and a message 'Pirate deleted'", async () => {
      const expectedStatus = 200;
      const expectedMessage = "Pirate deleted";

      const response = await request(app)
        .delete(`/pirates/${piratesMock[0]._id.toString()}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(expectedStatus);

      expect(response.body.message).toBe(expectedMessage);
    });
  });
});

describe("Given a POST '/create' endpoint", () => {
  describe("When it recieve a request with an idPirate and a new pirate named 'luffy'", () => {
    test("Then it should return a statusCode 201 and the new pirate with name 'luffy'", async () => {
      const expectedStatusCode = 201;

      const response = await request(app)
        .post(`/pirates/create`)
        .set("Authorization", `Bearer ${token}`)
        .send(luffyMock)
        .expect(expectedStatusCode);

      expect(response.body.newPirate.name).toBe(luffyMock.name);
    });
  });

  describe("When it recieve a request with an idAnimal and a new animal data named 'naiska' but the user is not logged in", () => {
    test("Then it should return a status code 401 and 'Invalid token' error message", async () => {
      const expectedStatusCode = 401;
      const expectedMessage = "Invalid token";

      const response = await request(app)
        .post(`/pirates/create`)
        .set("Authorization", `Bearer ${invalidTokenMock.password}`)
        .send(luffyMock)
        .expect(expectedStatusCode);

      expect(response.body.message).toBe(expectedMessage);
    });
  });
});
