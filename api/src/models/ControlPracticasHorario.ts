import { Schema, model } from "mongoose";

const practicasSchema = new Schema(
  {
    nro: {
      type: Number,
      requerid: true,
    },
    estado: {
      type: Number,
      requerid: true,
    },
    profesor: [
      {
        ref: "User",
        type: Schema.Types.ObjectId,
      },
    ],
    fecha: {
      type: Date,
      requerid: true,
    },
    horaInicio: {
      type: String,
      requerid: true,
    },
    horaSalida: {
      type: String,
      requerid: true,
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

export default model("ControlPracticasHorario", practicasSchema);
