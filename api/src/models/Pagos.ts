import { Schema, model } from "mongoose";

const pagosSchema = new Schema(
  {
    nuevoMonto: {
      type: Number,
      default: 0,
    },
    cantidad: {
      type: Number,
    },
    observacion: {
      type: String,
    },
    nroRecibo: {
      type: Number,
    },
    fecha: {
      type: Date,
    },
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
    tramites: {
      ref: "Tramite",
      type: Schema.Types.ObjectId,
    },
    sedes: {
      ref: "Sede",
      type: Schema.Types.ObjectId,
    },
    confirm: {
      type: Number,
      requerid: true,
    },
    stateRenta: {
      type: Boolean,
    },
    acuenta: {
      type: Number,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);
export default model("Pagos", pagosSchema);
