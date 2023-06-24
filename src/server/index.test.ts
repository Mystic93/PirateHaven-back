import request from "supertest";
import app from ".";

type CustomResponse = {
  status: number;
  body: { message: string };
};

describe("Given a GET '/' endpoint ", () => {
  describe("When it receives a request ", () => {
    test("Then it should call a response with status 200 and message 'Pong ok'", async () => {
      const expectedStatusCode = 200;
      const expectedMessage = "Pong ok";

      const response: CustomResponse = await request(app)
        .get("/")
        .expect(expectedStatusCode);

      expect(response.body.message).toBe(expectedMessage);
    });
  });
});
