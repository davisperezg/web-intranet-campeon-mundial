import axios from "axios";
import { Tramites } from "./Tramites";

const API = process.env.REACT_APP_API;

export const getTramites = async () => {
  return await axios.get<Tramites[]>(`${API}/v1/tramite`);
};

export const getTramiteById = async (id: string) => {
  return await axios.get<Tramites>(`${API}/v1/tramite/${id}`);
};

export const createNewTramite = async (video: Tramites) => {
  return await axios.post(`${API}/v1/tramite`, video);
};

export const deleteTramiteById = async (id: string) => {
  return await axios.delete(`${API}/v1/tramite/${id}`);
};

export const updateTramite = async (id: string, tramite: Tramites) => {
  return await axios.put(`${API}/v1/tramite/${id}`, tramite);
};
