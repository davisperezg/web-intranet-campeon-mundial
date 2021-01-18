import { User } from "./../Users/User";
import { Alumno } from "./../Alumnos/Alumno";

export interface Pagos {
  _id?: string;
  cantidad: string;
  nroRecibo: string;
  //fecha: Date;
  confirm?: Number;
  observacion?: string;
  registrador: string | undefined | User;
  estudiante: string | undefined | Alumno;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}
