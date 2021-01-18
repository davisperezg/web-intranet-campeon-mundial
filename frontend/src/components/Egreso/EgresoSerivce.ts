import axios from "axios";
import { Egresos } from "./Egresos";

const API = process.env.REACT_APP_API;

export const getEgresosHoy = async () => {
  return await axios.get<Egresos[]>(`${API}/v1/egresos/hoy`);
};

export const getEgresosTodos = async () => {
  return await axios.get<Egresos[]>(`${API}/v1/egresos`);
};

export const getEgresosXAdmin = async (id: string) => {
  return await axios.get<Egresos[]>(`${API}/v1/egresos/admin/${id}`);
};

//export const getEgresoById = async (id: string) => {
//  return await axios.get<Egresos>(`${API}/egresos/${id}`);
//};

export const createNewEgreso = async (egreso: Egresos) => {
  return await axios.post(`${API}/v1/egresos`, egreso);
};

//export const updateVideo = async (id: string, video: Video) => {
//  return await axios.put(`${API}/videos/${id}`, video);
//};
