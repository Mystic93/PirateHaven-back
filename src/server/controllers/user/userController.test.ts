import { type Response } from "express";
import { type UserStructure, type UserCredentialsRequest } from "../../types";
import { loginUser } from "./userController";
import User from "../../../database/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";
import CustomError from "../../../CustomError/CustomError";

beforeEach(() => {
  jest.clearAllMocks();
});

const req: Partial<UserCredentialsRequest> = {
  body: {
    username: "ari",
    password: "ari",
  },
};
const res: Partial<Response> = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};
const next = jest.fn();

const token = "tokensito";

describe("Given a loginUser controller", () => {
  describe("When it receives a request with a valid credentials and a response", () => {
    test("Then it should call the response's method with status code 200", async () => {
      const mockUser: UserStructure = {
        _id: new Types.ObjectId().toString(),
        username: "ari",
        password: "ari",
      };

      const expectedStatusCode = 200;

      User.findOne = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUser),
      });

      bcrypt.compare = jest.fn().mockReturnValue(true);

      jwt.sign = jest.fn().mockReturnValue(token);

      await loginUser(req as UserCredentialsRequest, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(expectedStatusCode);
    });
    test("Then it should call the response's method json with the token", async () => {
      await loginUser(req as UserCredentialsRequest, res as Response, next);

      expect(res.json).toHaveBeenCalledWith({ token });
    });
  });

  describe("When it receives a request with a wrong password and a next function", () => {
    test("Then it should call the next function with status code 401 and 'Wrong credential' message", async () => {
      const expectedError = new CustomError(401, "Wrong credential");

      bcrypt.compare = jest.fn().mockResolvedValue(false);

      await loginUser(req as UserCredentialsRequest, res as Response, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});
