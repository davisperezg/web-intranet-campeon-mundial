import { Schema, model } from "mongoose";

const asistenciaSchema = new Schema(
  {
    estado: {
      type: Number,
    },
    ingreso: {
      type: Date,
      requerid: true,
    },
    salida: {
      type: Date,
      requerid: true,
    },
    capitulo: {
      type: String,
    },
    estudiante: [
      {
        ref: "User",
        type: Schema.Types.ObjectId,
      },
    ],
  },
  {
    versionKey: false,
    timestamps: true,
  }
);
export default model("Asistencia", asistenciaSchema);
