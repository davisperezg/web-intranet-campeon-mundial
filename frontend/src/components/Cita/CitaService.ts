import axios from "axios";
import { Cita } from "./Cita";

const API = process.env.REACT_APP_API;

export const getCitas = async () => {
  return await axios.get<Cita[]>(`${API}/v1/citas`);
};

export const getCitasXalumno = async (id: String) => {
  return await axios.get<Cita[]>(`${API}/v1/citas/alumno/${id}`);
};

export const getCitaById = async (id: string) => {
  return await axios.get<Cita>(`${API}/v1/citas/${id}`);
};

export const createNewCita = async (cita: Cita) => {
  return await axios.post(`${API}/v1/citas`, cita);
};

export const updateCita = async (id: string, cita: Cita) => {
  return await axios.put(`${API}/v1/citas/${id}`, cita);
};
