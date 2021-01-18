import axios from "axios";
import { Roles } from "./Roles";

const API = process.env.REACT_APP_API;

export const getRoles = async () => {
  return await axios.get<Roles[]>(`${API}/v1/roles`);
};
