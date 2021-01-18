//import { Alumno } from "./../Alumnos/Alumno";
export interface Asistencia {
  _id?: string;
  estudiante: string;
  ingreso: string;
  salida: string;
  capitulo: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}
