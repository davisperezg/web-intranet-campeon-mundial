import axios from "axios";

//const API_RENIEC = process.env.REACT_APP_API_RENIEC;
const API_RENIEC = process.env.REACT_APP_API_RENIEC_PRODUCTION;
//https://web.kemaytechnology.com/api/consulta/reniec/72231218
export const consultDNI = async (dni: string) => {
  return await axios.get(`${API_RENIEC}/${dni}`);
};
