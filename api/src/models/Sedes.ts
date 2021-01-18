import { Schema, model } from "mongoose";

const sedechema = new Schema(
  {
    name: { type: String },
    seq: { type: Number },
  },

  {
    versionKey: false,
    timestamps: true,
  }
);
export default model("Sede", sedechema);
