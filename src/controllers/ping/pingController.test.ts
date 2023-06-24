import { type Request, type Response } from "express";
import pingController from "./pingController.js";

describe("Given a pingController controller", () => {
  describe("When it receives a response with method status 200 and a method json message with 'Pong ok'", () => {
    test("Then it shoul call the response's method with status 200 and message 'Pong ok'", () => {
      const req = {};
      const res: Pick<Response, "status" | "json"> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const expectedStatusCode = 200;
      const expectedResponseBody = { message: "Pong ok" };

      pingController(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(expectedStatusCode);
      expect(res.json).toHaveBeenCalledWith(expectedResponseBody);
    });
  });
});
