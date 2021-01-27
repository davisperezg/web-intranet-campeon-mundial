import { User } from "./../Users/User";
import { Alumno } from "./../Alumnos/Alumno";
import { Tramites } from "./../Tramites/Tramites";

export interface Pagos {
  _id?: string;
  cantidad: Number;
  nroRecibo: Number;
  //fecha: Date;
  confirm?: Number;
  observacion?: string;
  registrador: string | undefined | User;
  estudiante: string | undefined | Alumno;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  tramites: any;
  stateRenta: Boolean;
  acuenta: Number;
  nuevoMonto?: Number;
}
