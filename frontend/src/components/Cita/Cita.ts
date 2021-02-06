import { Alumno } from "./../Alumnos/Alumno";
import { User } from "./../Users/User";
export interface Cita {
  _id?: string;
  estudiante: string | Alumno;
  registrador: string | User;
  fecha: string | Date;
  fechaTermino: string | Date;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}
