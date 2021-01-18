import axios from "axios";

const API = process.env.REACT_APP_API;

export const postLogin = async (email: string, password: string) => {
  const dataLogin = {
    username: email,
    password: password,
  };
  return await axios.post(`${API}/v1/auth/signIn`, dataLogin);
};
