import { Schema, model } from "mongoose";

const contUserSchema = new Schema(
  {
    seq: Number,
  },
  {
    versionKey: false,
    timestamps: true,
  }
);
export default model("ContUsername", contUserSchema);
