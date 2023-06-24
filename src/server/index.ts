import express from "express";
import morgan from "morgan";
import cors from "cors";
import { notFoundError } from "./middlewares/notFoundError/notFoundError.js";
import { generalError } from "./middlewares/generalError/generalError.js";
import pingController from "./controllers/ping/pingController.js";
import userRouter from "./routers/userRouter.js";
import { getPirates } from "./controllers/pirates/piratesController.js";
import pirateRouter from "./routers/pirateRouter/pirateRouter.js";

const app = express();

const allowedOrigins = [
  process.env.ALLOWED_ORIGIN_PROD!,
  process.env.ALLOWED_ORIGIN_DEV!,
];

const options: cors.CorsOptions = {
  origin: allowedOrigins,
};

app.use(cors(options));

app.disable("x-powered-by");

app.use(express.json());

app.use(morgan("dev"));

app.use("/user", userRouter);

app.get("/pirates", getPirates);

app.get("/", pingController);

app.use("/pirates", pirateRouter);

app.use(notFoundError);

app.use(generalError);

export default app;
