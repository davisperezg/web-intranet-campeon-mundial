import axios from "axios";
import { Pagos } from "./Pagos";

const API = process.env.REACT_APP_API;

export const getPagos = async (id: string) => {
  return await axios.get<Pagos[]>(`${API}/v1/alumno/pagos/${id}`);
};

export const getPago = async (id: string) => {
  return await axios.get<Pagos>(`${API}/v1/pagos/${id}`);
};

export const getPagoXAlumno = async (id: string) => {
  return await axios.get<Pagos>(`${API}/v1/alumno/pagos/${id}`);
};

export const createNewPagos = async (pago: Pagos) => {
  return await axios.post(`${API}/v1/pagos`, pago);
};

export const deletePagosById = async (id: string) => {
  return await axios.delete(`${API}/v1/pagos/${id}`);
};

export const updatePagos = async (id: string, pago: Pagos) => {
  return await axios.put(`${API}/v1/pagos/${id}`, pago);
};

export const updateEstado = async (id: string, estado: Number) => {
  return await axios.put(`${API}/v1/pagos/${id}`, estado);
};
