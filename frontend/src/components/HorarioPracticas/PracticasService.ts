import axios from "axios";
import { Practicas } from "./Practicas";
import { User } from "./../Users/User";

const API = process.env.REACT_APP_API;

export const createNewPractica = async (practicas: Practicas) => {
  return await axios.post(`${API}/v1/practicas`, practicas);
};

export const getProfesores = async () => {
  return await axios.get<User[]>(`${API}/v1/profesores`);
};

export const getPracticasXAlumno = async (id: string) => {
  return await axios.get<Practicas[]>(`${API}/v1/practicas/alumno/${id}`);
};

export const deletePracticaById = async (id: string) => {
  return await axios.delete(`${API}/v1/practicas/${id}`);
};

export const updatePractica = async (id: string, practica: Practicas) => {
  return await axios.put(`${API}/v1/practicas/${id}`, practica);
};

export const getPracticaById = async (id: string) => {
  return await axios.get<Practicas>(`${API}/v1/practicas/${id}`);
};
