import axios from "axios";
import { User } from "./User";

const API = process.env.REACT_APP_API;

export const getData = async () => {
  return await axios.get<User[]>(`${API}/v1/auth/user`);
};

export const postRefresh = async (
  username: String | null,
  refreshToken: String | null
) => {
  const dataUser = {
    username: username,
    refreshToken: refreshToken,
  };
  return await axios.post<User[]>(`${API}/v1/auth/token`, dataUser);
};
