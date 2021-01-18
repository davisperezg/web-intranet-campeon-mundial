import axios from "axios";
import { Sedes } from "./Sedes";

const API = process.env.REACT_APP_API;

export const getSedes = async () => {
  return await axios.get<Sedes[]>(`${API}/v1/sedes`);
};

export const getSedesById = async (id: string) => {
  return await axios.get<Sedes>(`${API}/v1/sedes/${id}`);
};

export const updateSedes = async (id: string, sedes: Sedes) => {
  return await axios.put(`${API}/v1/sedes/${id}`, sedes);
};
