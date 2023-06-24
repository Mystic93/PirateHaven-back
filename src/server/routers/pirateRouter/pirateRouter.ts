import { Router } from "express";
import {
  createPirate,
  deletePirates,
  getPirates,
} from "../../controllers/pirates/piratesController.js";
import { auth } from "../../middlewares/authMiddleware/authMiddleware.js";
import { validate } from "express-validation";
import { createPirateSchema } from "../../utils/schemas/PirateSchema.js";

const pirateRouter = Router();

pirateRouter.get("/", getPirates);

pirateRouter.delete("/:piratesId", auth, deletePirates);

pirateRouter.post(
  "/create",
  auth,
  validate(createPirateSchema, {}, { abortEarly: false }),
  createPirate
);

export default pirateRouter;
