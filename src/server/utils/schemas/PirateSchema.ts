import { Joi } from "express-validation";
import { type PirateStructure } from "../../../mocks/piratesMock";

export const createPirateSchema = {
  body: Joi.object<PirateStructure>({
    name: Joi.string().required(),
    bounty: Joi.number().required(),
    hasDevilFruit: Joi.boolean().required(),
    isAlive: Joi.boolean().required(),
    imgUrl: Joi.string().required(),
    crew: Joi.string().required(),
    position: Joi.string().required(),
    dream: Joi.string(),
  }),
};
