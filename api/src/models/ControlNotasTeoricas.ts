import { Schema, model } from "mongoose";

const notasTeoricasSchema = new Schema(
  {
    tipoNota: {
      type: String,
      requerid: true,
      uppercase: true,
      trim: true,
    },
    nota: {
      type: Number,
      requerid: true,
      trim: true,
      min: 0,
      max: 35,
    },
    notaObtuvidaSegundoIntento: {
      type: Number,
    },
    estudiante: [
      {
        ref: "User",
        type: Schema.Types.ObjectId,
        requerid: true,
      },
    ],
    estado: {
      type: Number,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);
export default model("Notas", notasTeoricasSchema);
