import axios from "axios";
import { Egresos } from "../Egreso/Egresos";
import { Pagos } from "../Pagos/Pagos";

const API = process.env.REACT_APP_API;

export const getIngresos = async () => {
  return await axios.get<Pagos[]>(`${API}/v1/ingresos`);
};

export const getEgresos = async () => {
  return await axios.get<Egresos[]>(`${API}/v1/egresos`);
};
