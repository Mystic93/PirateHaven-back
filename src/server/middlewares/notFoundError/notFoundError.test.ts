import { type NextFunction, type Request, type Response } from "express";
import CustomError from "../../../CustomError/CustomError.js";
import { notFoundError } from "./notFoundError";

type CustomResponse = Pick<Response, "status" | "json">;

const response: CustomResponse = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

const request = {};
const next = jest.fn();

describe("Given a notFoundError function", () => {
  describe("When it receives a next function", () => {
    test("Then it should call it with the custom error with status code 404 and message 'Sorry endpoint not found'", () => {
      const customError = new CustomError(404, "Sorry endpoint not found");

      notFoundError(
        request as Request,
        response as Response,
        next as NextFunction
      );

      expect(next).toHaveBeenCalledWith(customError);
    });
  });
});
