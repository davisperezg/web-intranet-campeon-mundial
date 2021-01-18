import axios from "axios";
import { User } from "./User";

const API = process.env.REACT_APP_API;

export const getData = async () => {
  return await axios.get<User[]>(`${API}/v1/auth/user`);
};
