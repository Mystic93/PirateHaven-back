import { type Request, type Response, type NextFunction } from "express";
import CustomError from "../../../CustomError/CustomError.js";

export const notFoundError = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const error = new CustomError(404, "Sorry endpoint not found");

  next(error);
};
