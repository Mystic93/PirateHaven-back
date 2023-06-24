import { type Request, type Response, type NextFunction } from "express";
import chalk from "chalk";
import type CustomError from "../../../CustomError/CustomError.js";
import createDebug from "debug";
import { ValidationError } from "express-validation";

const debug = createDebug(
  "piratehaven-api:root:server:middlewares:generalError:generalError"
);

export const generalError = (
  error: CustomError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (error instanceof ValidationError) {
    const validationErrorMessages = error.details.body
      ?.map((joiError) => joiError.message)
      .join(" & ")
      .replaceAll('"', "");

    (error as CustomError).publicMessage = validationErrorMessages;

    debug(chalk.redBright(validationErrorMessages));
  }

  debug(error.message);

  const statusCode = error.statusCode || 500;
  const message = error.statusCode
    ? error.message
    : "General error try again soon";

  res.status(statusCode).json({ message });
};
