import axios from "axios";
export const postLogin = async (email: string, password: string) => {
  const dataLogin = {
    username: email,
    password: password,
  };
  return await axios.post("v1/auth/signIn", dataLogin);
};
