import { Schema, model } from "mongoose";

const documentosSchema = new Schema(
  {
    estado: {
      type: Number,
      required: true,
    },
    observacion: {
      type: String,
    },
    fechaEntregaBalotario: {
      type: Date,
    },
    fechaEntregaCertificadoMedico: {
      type: Date,
    },
    fechaEntregaCertificadoCofipro: {
      type: Date,
    },
    fechaEntregaCarnet: {
      type: Date,
    },
    fechaEntregaGuiaManejo: {
      type: Date,
    },
    fechaEntregaActa: {
      type: Date,
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
export default model("Documentos", documentosSchema);
