import axios from "axios";
import { Asistencia } from "./Asistencia";

const API = process.env.REACT_APP_API;

export const createAsistencia = async (asistencia: Asistencia) => {
  return await axios.post(`${API}/v1/asistencia`, asistencia);
};

export const deleteAsistencia = async (id: string) => {
  return await axios.delete(`${API}/v1/asistencia/${id}`);
};

export const updateAsistencia = async (id: string, asistencia: Asistencia) => {
  return await axios.put(`${API}/v1/asistencia/${id}`, asistencia);
};

export const getAsistenciaById = async (id: string) => {
  return await axios.get<Asistencia>(`${API}/v1/asistencia/${id}`);
};

export const getAsistenciaXAlumno = async (id: string) => {
  return await axios.get<Asistencia[]>(`${API}/v1/asistencia/alumno/${id}`);
};
