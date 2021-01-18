import axios from "axios";
import { Alumno } from "../Alumnos/Alumno";

const API = process.env.REACT_APP_API;

export const getAdministradores = async () => {
  return await axios.get<Alumno[]>(`${API}/v1/user`);
};

export const getAdministrador = async (id: string) => {
  return await axios.get<Alumno>(`${API}/v1/user/${id}`);
};

export const createNewAdmin = async (admin: Alumno) => {
  return await axios.post(`${API}/v1/auth/signUp`, admin);
};

export const desUser = async (id: string) => {
  return await axios.delete(`${API}/v1/user/${id}`);
};

export const habUser = async (id: string) => {
  return await axios.put(`${API}/v1/activate/user/${id}`);
};

export const updateAdmin = async (id: string, admin: Alumno) => {
  return await axios.put(`${API}/v1/user/${id}`, admin);
};
