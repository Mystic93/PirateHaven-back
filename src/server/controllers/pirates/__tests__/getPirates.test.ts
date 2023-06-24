import { type NextFunction, type Response } from "express";
import Pirate from "../../../../database/models/Pirate";
import { piratesMock } from "../../../../mocks/piratesMock";
import { getPirates } from "../piratesController";
import { type CustomRequest } from "../../../types";

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Given a getPirates controller", () => {
  const req = {};

  const res: Partial<Response> = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  const next = jest.fn();

  describe("When it receives a request", () => {
    Pirate.find = jest.fn().mockReturnValue({
      sort: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue(piratesMock),
    });
    test("Then it should call response's method with status code '200' and json response's method with a list of pirates", async () => {
      const expectedStatudCode = 200;
      const expectedPirates = piratesMock;

      await getPirates(
        req as CustomRequest,
        res as Response,
        next as NextFunction
      );

      expect(res.json).toHaveBeenCalledWith(expectedPirates);
      expect(res.status).toHaveBeenCalledWith(expectedStatudCode);
    });
  });

  describe("When it receives a request and a next function", () => {
    test("Then it should call the next function with the message 'Error connecting database to get pirates'", async () => {
      const error = new Error("Error connecting database to get pirates");

      Pirate.find = jest.fn().mockReturnValue({
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockRejectedValue(error),
      });

      await getPirates(
        req as CustomRequest,
        res as Response,
        next as NextFunction
      );

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
