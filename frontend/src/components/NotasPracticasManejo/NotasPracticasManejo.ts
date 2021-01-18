import { User } from "./../Users/User";
import { Alumno } from "./../Alumnos/Alumno";
export interface NotasPracticaManejo {
  _id?: string;
  estadoAlumno: string;
  etapa?: string;
  registrador: string | User;
  estudiante: string | Alumno;
  createdAt?: string;
  updateAt?: string;
}
