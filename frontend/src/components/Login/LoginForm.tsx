import React, {
  useState,
  useContext,
  ChangeEvent,
  FormEvent,
  useEffect,
} from "react";
import { useHistory } from "react-router-dom";

import "./LoginForm.css";
import { UserContext } from "../Context/UserContext";
import * as LoginService from "./LoginService";
import {
  deleteToken,
  getToken,
  setRefreshToken,
  setToken,
} from "../Helpers/AuthToken";
import { toast } from "react-toastify";
const LoginForm = () => {
  //userData
  const history = useHistory();

  const { setUserData, userData }: any = useContext(UserContext);
  const [login, setLogin] = useState({
    username: "",
    password: "",
  });
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLogin({ ...login, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await LoginService.postLogin(login.username, login.password);
      setToken(res.data.token);
      setRefreshToken(res.data.refreshToken);
      window.location.href = "/";
      //history.push("/");
    } catch (e) {
      console.log(e);
      toast.error(JSON.parse(e.request.response).message);
    }
  };

  useEffect(() => {
    if (!getToken()) {
      setUserData({ session: "false" });
      return;
    }
  }, [userData.estado, setUserData]);

  return (
    <div className="centerLogin">
      <div
        className="card border-primary mb-3"
        style={{ maxWidth: "20rem", width: "500px" }}
      >
        <div className="card-header">Login</div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="exampleInputEmail1">Username</label>
              <input
                type="text"
                className="form-control"
                id="idUsername"
                aria-describedby="usernameHelp"
                name="username"
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="exampleInputEmail1">Contraseña</label>
              <input
                type="password"
                className="form-control"
                id="idContrasenia"
                aria-describedby="contraseniaHelp"
                name="password"
                onChange={handleInputChange}
              />
              <div className="form-group"></div>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: "100%" }}
              >
                Iniciar sesión
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
