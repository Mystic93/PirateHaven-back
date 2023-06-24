import { type NextFunction, type Response } from "express";
import bcrypt from "bcryptjs";
import { type UserCredentialsRequest } from "../../types";
import User from "../../../database/models/User.js";
import CustomError from "../../../CustomError/CustomError.js";
import jwt, { type JwtPayload } from "jsonwebtoken";

export const loginUser = async (
  req: UserCredentialsRequest,
  res: Response,
  next: NextFunction
) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username }).exec();

    if (!user || !(await bcrypt.compare(password, user.password))) {
      const error = new CustomError(401, "Wrong credential");

      throw error;
    }

    const tokenPayload: JwtPayload = {
      sub: user._id.toString(),
    };

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET!, {
      expiresIn: "300d",
    });

    res.status(200).json({ token });
  } catch (error) {
    next(error);
  }
};
