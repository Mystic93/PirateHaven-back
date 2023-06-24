import { type NextFunction, type Response } from "express";
import Pirate from "../../../../database/models/Pirate";
import { piratesMock } from "../../../../mocks/piratesMock";
import { type CustomRequest } from "../../../types";
import { deletePirates } from "../piratesController";

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Given a deletePirate controller", () => {
  const next = jest.fn();

  const res: Partial<Response> = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  const req: Partial<CustomRequest> = {
    params: {
      piratesId: piratesMock[0]._id.toString(),
    },
  };
  describe("When it receives a request with a valid user id and pirate id ", () => {
    test("Then it should call the response's status method with '200'", async () => {
      const expectedStatusCode = 200;

      Pirate.findOneAndDelete = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(piratesMock[0]),
      });

      await deletePirates(
        req as CustomRequest,
        res as Response,
        next as NextFunction
      );

      expect(res.status).toHaveBeenCalledWith(expectedStatusCode);
    });
  });

  describe("When it receives a request with a valid user id and pirate id", () => {
    test("Then it should call the response's json method with the message 'Pirate deleted'", async () => {
      const expectedMessage = "Pirate deleted";

      Pirate.findOneAndDelete = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(piratesMock[0]),
      });

      await deletePirates(
        req as CustomRequest,
        res as Response,
        next as NextFunction
      );

      expect(res.json).toHaveBeenCalledWith({ message: expectedMessage });
    });
  });

  describe("When it receives a request with a valid user id and invalid pirate id", () => {
    test("Then it should call the response's status method with '404'", async () => {
      const expectedStatusCode = 404;

      Pirate.findOneAndDelete = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(undefined),
      });

      await deletePirates(
        req as CustomRequest,
        res as Response,
        next as NextFunction
      );

      expect(res.status).toHaveBeenCalledWith(expectedStatusCode);
    });
  });

  describe("When it receives a request with an user id and invalid pirate id", () => {
    test("Then it should call the response's json method with the message 'Pirate deleted'", async () => {
      const expectedMessage = "Pirate deleted";

      Pirate.findOneAndDelete = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(undefined),
      });

      await deletePirates(
        req as CustomRequest,
        res as Response,
        next as NextFunction
      );

      expect(res.json).toHaveBeenCalledWith({ message: expectedMessage });
    });
  });

  describe("When it receives a next function and the exec method rejects with a 'Error connecting database to get pirates'", () => {
    test("Then it should call next function with the error 'Error connecting database to get pirates'", async () => {
      const expectedError = new Error(
        " Error connecting database to get pirates"
      );

      Pirate.findOneAndDelete = jest.fn().mockReturnValue({
        exec: jest.fn().mockRejectedValue(expectedError),
      });

      await deletePirates(
        req as CustomRequest,
        res as Response,
        next as NextFunction
      );

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});
