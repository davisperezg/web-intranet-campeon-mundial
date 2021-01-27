import { Schema, model } from "mongoose";

const tramitechema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    status: { type: Number, required: true, trim: true },
    costo: { type: Number, required: true, trim: true },
  },

  {
    versionKey: false,
    timestamps: true,
  }
);
export default model("Tramite", tramitechema);
