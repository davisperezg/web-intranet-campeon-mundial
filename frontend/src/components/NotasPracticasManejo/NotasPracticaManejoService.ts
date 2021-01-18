import axios from "axios";
import { NotasPracticaManejo } from "./NotasPracticasManejo";

const API = process.env.REACT_APP_API;

export const getNotasPracticaXAlumno = async (id: string) => {
  return await axios.get<NotasPracticaManejo[]>(
    `${API}/v1/nota/manejo/alumno/${id}`
  );
};

export const createNewNotaPractica = async (nota: NotasPracticaManejo) => {
  return await axios.post(`${API}/v1/nota/manejo`, nota);
};
