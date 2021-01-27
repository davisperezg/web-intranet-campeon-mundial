import React, { useEffect, useContext } from "react";
import { deleteToken, deleteRefreshToken } from "../Helpers/AuthToken";
import { useHistory } from "react-router-dom";
import * as userService from "../Users/UserService";
import { UserContext } from "../Context/UserContext";
export const CargaUser = () => {
  const { setUserData }: any = useContext(UserContext);

  const cargaUsuario = async () => {
    try {
      await userService.getData();
    } catch (e) {
      setUserData({ state: false });
    }
  };
  useEffect(() => {
    cargaUsuario();
  }, []);
};

const MostarSesionTerminada = () => {
  const history = useHistory();
  return (
    <h1>
      Sesión terminada. Recargue la{" "}
      <a
        style={{ color: "blue", cursor: "pointer" }}
        onClick={() => {
          window.location.reload();
        }}
      >
        página
      </a>{" "}
      o vuelva al{" "}
      <a
        style={{ color: "blue", cursor: "pointer" }}
        onClick={() => {
          deleteToken();
          deleteRefreshToken();
          localStorage.removeItem("username");
          history.push("/login");
        }}
      >
        login.
      </a>
    </h1>
  );
};

export default MostarSesionTerminada;
