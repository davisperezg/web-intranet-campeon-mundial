import axios from "axios";
import { Alumno } from "../Alumnos/Alumno";
import { NotasTeoricas } from "./NotasTeoricas";

const API = process.env.REACT_APP_API;

export const getAlumnos = async () => {
  return await axios.get<Alumno[]>(`${API}/v1/alumnos`);
};

export const getConsultAndValidate = async (
  tipo: string,
  estudiante: string
) => {
  return await axios.get<NotasTeoricas[]>(
    `${API}/v1/alumnos/validate/${tipo}/${estudiante}`
  );
};

export const getNotasXAlumnos = async (id: string) => {
  return await axios.get<NotasTeoricas[]>(`${API}/v1/alumnos/notas/${id}`);
};

export const getNotasXAlumnosS = async (id: string) => {
  return await axios.get<NotasTeoricas[]>(`${API}/v1/alumnos/notass/${id}`);
};

export const getAlumno = async (id: string) => {
  return await axios.get<Alumno>(`${API}/v1/alumnos/name/${id}`);
};

export const createNewNota = async (nota: NotasTeoricas) => {
  return await axios.post(`${API}/v1/notas`, nota);
};

export const createNewNotaS = async (nota: NotasTeoricas) => {
  return await axios.post(`${API}/v1/notass`, nota);
};
