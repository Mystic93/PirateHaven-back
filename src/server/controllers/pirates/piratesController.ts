import { type NextFunction, type Response } from "express";
import createDebug from "debug";
import { type CustomRequest } from "../../types";
import Pirate from "../../../database/models/Pirate.js";
import { Types } from "mongoose";
import CustomError from "../../../CustomError/CustomError.js";

const debug = createDebug(
  "piratehaven-api:controllers:pirates:piratesController"
);

export const getPirates = async (
  _req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const pirates = await Pirate.find().sort({ _id: -1 }).limit(10).exec();
    res.status(200).json(pirates);
  } catch (error) {
    error.message = "Error connecting database to get pirates";
    debug(error.message);

    next(error);
  }
};

export const deletePirates = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const _id = req.params.piratesId;

    const pirate = await Pirate.findByIdAndDelete({ _id }).exec();

    if (!pirate) {
      res.status(404).json({ message: "Pirate not found" });
    }

    res.status(200).json({ message: "Pirate deleted" });
  } catch (error) {
    next(error);
  }
};

export const createPirate = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const { userId, body } = req;

  try {
    const newPirate = await Pirate.create({
      ...body,
      user: new Types.ObjectId(userId),
    });

    if (!newPirate) {
      const error = new CustomError(404, "Error while adding pirate");
      throw error;
    }

    res.status(201).json({ newPirate });
  } catch (error: unknown) {
    next(error);
  }
};
