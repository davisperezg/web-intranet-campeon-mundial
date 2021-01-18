import { User } from "./../Users/User";
export interface Practicas {
  _id?: string;

  profesor: string | User;
  estudiante: string;
  fecha: string;
  horaInicio: string;
  horaSalida: string;
  nro: Number | string;

  createdAt?: string | Date;
  updatedAt?: string | Date;
}
