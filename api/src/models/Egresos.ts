import { Schema, model } from "mongoose";

const egresosSchema = new Schema(
  {
    detalle: {
      type: String,
      required: true,
    },
    cantidad: {
      type: Number,
      required: true,
      trim: true,
    },
    registrador: [
      {
        ref: "User",
        type: Schema.Types.ObjectId,
      },
    ],
    sedes: {
      ref: "Sede",
      type: Schema.Types.ObjectId,
    },
    estado: { type: Number, required: true, trim: true },
  },

  {
    versionKey: false,
    timestamps: true,
  }
);

export default model("Egresos", egresosSchema);
