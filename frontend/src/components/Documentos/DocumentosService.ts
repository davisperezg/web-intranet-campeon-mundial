import axios from "axios";
import { Documentos } from "./Documentos";

const API = process.env.REACT_APP_API;

export const getDocumentos = async (id: string) => {
  return await axios.get<Documentos[]>(`${API}/v1/alumno/documentos/${id}`);
};

export const getDocumento = async (id: string) => {
  return await axios.get<Documentos>(`${API}/v1/documentos/${id}`);
};

export const createNewDocumentos = async (pago: Documentos) => {
  return await axios.post(`${API}/v1/documentos`, pago);
};

export const deleteDocumentosById = async (id: string) => {
  return await axios.delete(`${API}/v1/documentos/${id}`);
};

export const updateDocumentos = async (id: string, pago: Documentos) => {
  return await axios.put(`${API}/v1/documentos/${id}`, pago);
};
