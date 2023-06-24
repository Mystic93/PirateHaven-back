import { type Response } from "express";
import Pirate from "../../../../database/models/Pirate";
import { luffyMock } from "../../../../mocks/piratesMock";
import { type CustomRequest } from "../../../types";
import { createPirate } from "../piratesController";
import CustomError from "../../../../CustomError/CustomError";

type CustomResponse = Pick<Response, "status" | "json">;
type CustomRequestWithBody = Pick<CustomRequest, "userId" | "body">;

const res: CustomResponse = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

const next = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Given a createPirate controler", () => {
  const req: CustomRequestWithBody = {
    userId: "64710077b5f9829cfe43b6a8",
    body: luffyMock,
  };

  describe("When it recieve a request with an userId and a body", () => {
    test("Then it should call the response's method status with 201", async () => {
      Pirate.create = jest.fn().mockResolvedValue(luffyMock);

      const expectedStatusCode = 201;

      await createPirate(req as CustomRequest, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(expectedStatusCode);
    });

    test("Then it should call the response's method json with the new created pirate", async () => {
      Pirate.create = jest.fn().mockResolvedValue(luffyMock);

      const expectedResponseBody = luffyMock;

      await createPirate(req as CustomRequest, res as Response, next);

      expect(res.json).toHaveBeenCalledWith({
        newPirate: expectedResponseBody,
      });
    });

    describe("When it recieve a request with an not valid userId or body", () => {
      test("Then it should call next function with the 'Error while adding pirate' error", async () => {
        const expectedCustomError = new CustomError(
          404,
          "Error while adding pirate"
        );

        Pirate.create = jest.fn().mockResolvedValue(undefined);

        await createPirate(req as CustomRequest, res as Response, next);

        expect(next).toHaveBeenCalledWith(expectedCustomError);
      });
    });
  });

  describe("When it receives a next function with an 'Error while adding pirate", () => {
    test("Then it should call next function with the 'Error while adding pirate", async () => {
      const expectedError = new Error("Error while adding pirate");

      Pirate.create = jest.fn().mockRejectedValue(expectedError);

      await createPirate(req as CustomRequest, res as Response, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});
