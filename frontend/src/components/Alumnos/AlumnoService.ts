import axios from "axios";
import { Tramites } from "../Tramites/Tramites";
import { Alumno } from "./Alumno";

const API = process.env.REACT_APP_API;

export const getAlumnos = async () => {
  return await axios.get<Alumno[]>(`${API}/v1/students`);
};

export const getAlumno = async (id: string) => {
  return await axios.get<Alumno>(`${API}/v1/students/${id}`);
};

export const createNewAlumnos = async (estudiante: Alumno) => {
  return await axios.post(`${API}/v1/students`, estudiante);
};
//deshabilitar
export const deleteAlumnosById = async (id: string) => {
  return await axios.delete(`${API}/v1/students/${id}`);
};
//habilitar
export const habAlumnosById = async (id: string) => {
  return await axios.put(`${API}/v1/activate/students/${id}`);
};

export const updateAlumnos = async (id: string, estudiante: Alumno) => {
  return await axios.put(`${API}/v1/students/${id}`, estudiante);
};

export const consultNroOfUsername = async () => {
  return await axios.get(`${API}/v1/students/consult/seq`);
};

export const updateNroOfUsername = async () => {
  return await axios.put(`${API}/v1/students/update/seq`);
};

export const getTramites = async () => {
  return await axios.get<Tramites[]>(`${API}/v1/tramite`);
};
