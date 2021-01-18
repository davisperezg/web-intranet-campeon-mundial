import { User } from "./../Users/User";

export interface Egresos {
  _id?: string;
  detalle: string;
  cantidad: number;
  registrador?: User[] | string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}
