import { Schema, model } from "mongoose";

const pirateSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  bounty: {
    type: Number,
    required: true,
  },
  hasDevilFruit: {
    type: Boolean,
    required: true,
  },
  isAlive: {
    type: Boolean,
    required: true,
  },
  imgUrl: {
    type: String,
    required: true,
  },
  crew: {
    type: String,
    required: true,
  },
  position: {
    type: String,
    required: true,
  },

  dream: String,
});

const Pirate = model("Pirate", pirateSchema, "pirates");

export default Pirate;
