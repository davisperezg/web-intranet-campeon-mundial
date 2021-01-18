import { Schema, model } from "mongoose";

const notasManejo = new Schema(
  {
    estadoAlumno: {
      type: String,
      required: true,
      trim: true,
    },
    etapa: {
      type: String,
      unique: true,
    },
    registrador: {
      ref: "User",
      type: Schema.Types.ObjectId,
    },
    estudiante: {
      ref: "User",
      type: Schema.Types.ObjectId,
    },

    estado: { type: Number, required: true, trim: true },
  },

  {
    versionKey: false,
    timestamps: true,
  }
);

export default model("NotasManejo", notasManejo);
