import "../../../loadEnvironment.js";
import { type NextFunction, type Response } from "express";
import { userToken } from "../../../mocks/usersMock";
import jwt from "jsonwebtoken";
import { type CustomRequest } from "../../types";
import { auth } from "./authMiddleware";
import CustomError from "../../../CustomError/CustomError";

beforeEach(() => {
  jest.clearAllMocks();
});

const res = {};
const req: Partial<CustomRequest> = {
  header: jest.fn().mockReturnValue(`Bearer ${userToken}`),
};
const next = jest.fn();

describe("Given an authMiddleware", () => {
  describe("When it receives a request with 'Authorization' header and a next function with a valid token", () => {
    test("Then it should call the received next function", () => {
      jwt.verify = jest.fn().mockReturnValue("id");
      auth(req as CustomRequest, res as Response, next as NextFunction);

      expect(next).toHaveBeenCalled();
    });
  });

  describe("When it receives a request with 'Authorization' header and a next function with an invalid token", () => {
    test("Then it should call the received next function with an error with status code '401' and the message 'Invalid token'", () => {
      const expectedError = new CustomError(401, "Invalid token");
      expectedError.name = "JsonWebTokenError";

      jwt.verify = jest.fn().mockImplementation(() => {
        throw expectedError;
      });

      auth(req as CustomRequest, res as Response, next as NextFunction);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });

  describe("When it receives a request with 'Authorization' header without token and a next function", () => {
    test("Then it should call the received next function with an error with status code '401' and the message 'Missing token'", () => {
      const req: Partial<CustomRequest> = {
        header: jest.fn().mockReturnValue(userToken),
        userId: "",
      };

      const expectedError = new CustomError(401, "Missing token");

      auth(req as CustomRequest, res as Response, next as NextFunction);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});
