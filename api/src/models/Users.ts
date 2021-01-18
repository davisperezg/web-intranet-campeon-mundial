import { Schema, model } from "mongoose";
const userSchema = new Schema(
  {
    registrador: {
      type: String,
      requerid: true,
      uppercase: false,
    },
    estado: {
      type: Number,
      requerid: true,
    },
    nivel: {
      type: Number,
      requerid: true,
      trim: true,
    },
    nombres: {
      type: String,
      required: [true, "Completar nombres"],
      uppercase: true,
    },
    username: {
      type: String,
      unique: true,
      required: [true, "Completar username"],
      trim: true,
      uppercase: true,
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Completar correo"],
      trim: true,
      uppercase: true,
    },
    password: {
      type: String,
      //required: [true, "Completar password"],
    },
    dni: {
      type: String,
      unique: true,
      required: [true, "Completar D.N.I"],
      trim: true,
      uppercase: true,
      minlength: 8,
      maxlength: 8,
    },
    address: {
      type: String,
      uppercase: true,
    },
    telephone: {
      type: String,
      //minlength: 7,
      //maxlength: 7,
      trim: true,
    },
    cellphone: {
      type: String,
      minlength: [9, "Dígitos mínimo del celular es 9 caracteres"],
      maxlength: [9, "Dígitos máximo del celular es 9 caracteres"],
      required: [true, "Completar celular"],
      trim: true,
      unique: true,
    },
    startClasses: {
      type: Date,
    },
    endClasses: {
      type: Date,
    },
    roles: [
      {
        ref: "Role",
        type: Schema.Types.ObjectId,
      },
    ],
    tramites: [
      {
        ref: "Tramite",
        type: Schema.Types.ObjectId,
      },
    ],
    nro: {
      ref: "Sede",
      type: Schema.Types.Number,
    },
    sedes: [
      {
        ref: "Sede",
        type: Schema.Types.ObjectId,
        required: true,
      },
    ],
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export default model("User", userSchema);
