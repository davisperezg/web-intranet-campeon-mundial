import { Roles } from "../Roles/Roles";
import { Sedes } from "./../Sedes/Sedes";
import { Tramites } from "./../Tramites/Tramites";

export interface Alumno {
  _id?: string;
  registrador?: string;
  nombres: string;
  username: string;
  email?: string;
  password?: string;
  dni: string;
  cellphone: string;
  address?: string;
  facebook?: string;
  telephone?: string;
  startClasses?: string;
  endClasses?: string;
  sedes: Sedes[] | string;
  tramites?: Tramites[] | string;
  nro?: Number;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  roles?: Roles[] | string;
  nivel?: string;
}
