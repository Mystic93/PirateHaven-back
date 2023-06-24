import { type NextFunction, type Request, type Response } from "express";
import CustomError from "../../../CustomError/CustomError.js";
import { generalError } from "./generalError";

type CustomResponse = Pick<Response, "status" | "json">;

const response: CustomResponse = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

const request = {};
const next = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Given a general error function", () => {
  describe("When called with and an unknown error", () => {
    test("Then it should call response with code 500 and json with 'General error try again soon'", () => {
      const error = new Error("General error try again soon");
      const statusCode = 500;
      const { message } = error;

      generalError(
        error as CustomError,
        request as Request,
        response as Response,
        next as NextFunction
      );

      expect(response.status).toHaveBeenCalledWith(statusCode);
      expect(response.json).toHaveBeenCalledWith({ message });
    });
  });
  describe("When it's called with a custom error with status code 404 and 'Endpoint not found' message", () => {
    test("Then it should call response with statusCode 404 and a 'Endpoint not found' message", () => {
      const error = new CustomError(404, "Endpoint not found");
      const statusCode = 404;
      const { message } = error;

      generalError(
        error,
        request as Request,
        response as Response,
        next as NextFunction
      );

      expect(response.status).toHaveBeenCalledWith(statusCode);
      expect(response.json).toHaveBeenCalledWith({ message });
    });
  });
});
