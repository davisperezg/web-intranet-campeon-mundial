import { Schema, model } from "mongoose";

const citasSchema = new Schema(
  {
    estado: {
      type: Number,
      requerid: true,
    },
    registrador: {
      ref: "User",
      type: Schema.Types.ObjectId,
    },
    estudiante: {
      ref: "User",
      type: Schema.Types.ObjectId,
    },

    fecha: {
      type: Date,
      requerid: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);
export default model("Citas", citasSchema);
