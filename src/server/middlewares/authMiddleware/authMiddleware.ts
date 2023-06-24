import { type NextFunction, type Response } from "express";
import { type CustomRequest } from "../../types.js";
import jwt from "jsonwebtoken";
import CustomError from "../../../CustomError/CustomError.js";

export const auth = (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const authorizationHeader = req.header("Authorization");
    if (!authorizationHeader?.includes("Bearer")) {
      const customError = new CustomError(401, "Missing token");

      throw customError;
    }

    const token = authorizationHeader.replace("Bearer ", "");

    const payload = jwt.verify(token, process.env.JWT_SECRET!);

    const userId = payload.sub as string;

    req.userId = userId;

    next();
  } catch (error: unknown) {
    const customError =
      (error as CustomError).name === "JsonWebTokenError"
        ? new CustomError(401, "Invalid token")
        : error;

    next(customError);
  }
};
