/* eslint-disable eqeqeq */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useContext, useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { UserContext } from "../Context/UserContext";
import { deleteToken, deleteRefreshToken } from "../Helpers/AuthToken";
import "./Navbar.css";

const Navbar = () => {
  const history = useHistory();

  const { userData, setUserData }: any = useContext(UserContext);

  const [show, setShow] = useState("dropdown-menu show");

  const [showDropdown, setShowDropdown] = useState("nav-item dropdown");

  const [showDropdownMenu, setShowDropdownMenu] = useState("dropdown-menu");

  const [styleShow, setStyleShow] = useState("none");

  const drop = () => {
    if (showDropdown === "nav-item dropdown") {
      setShowDropdown("nav-item dropdown show");
      setShowDropdownMenu("dropdown-menu show");
    } else {
      setShowDropdown("nav-item dropdown");
      setShowDropdownMenu("dropdown-menu");
    }
  };

  const dropLogin = () => {
    if (show === "dropdown-menu show") {
      setStyleShow("block");
      setShow("dropdown-menu");
    } else {
      setStyleShow("none");
      setShow("dropdown-menu show");
    }
  };

  const [isLogout, setIsLogout] = useState(true);

  const logout = () => {
    setUserData({ session: "false" });
    setIsLogout(false);
    deleteToken();
    deleteRefreshToken();
    localStorage.removeItem("username");
    history.push("/login");
  };

  useEffect(() => {
    if (userData.estado === 2) {
      deleteToken();
      history.push("/login");
      return;
    }
    if (userData.session) {
      history.push("/login");
      return;
    }
  }, [userData.estado, userData.session, history]);

  //ID , ROLE, USERNAME, NAME
  //Object.entries(userData).length === 0

  return (
    <div>
      {userData.session === "false" ? (
        <div></div>
      ) : (
        <>
          {isLogout === false ? (
            <div></div>
          ) : (
            <div>
              <nav
                className="yellow navbar navbar-expand-lg navbar-light bg-light"
                style={{ padding: "5px" }}
              >
                <div className="container">
                  <Link className="navbar-brand" to="/">
                    <img
                      src="https://images-campeon-mundial.s3-sa-east-1.amazonaws.com/LogoCampeonMundial-BlancoContorno.png"
                      alt="Logo"
                    ></img>
                  </Link>
                  <button
                    className="navbar-toggler"
                    type="button"
                    data-toggle="collapse"
                    data-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                  >
                    <span className="navbar-toggler-icon"></span>
                  </button>
                  <div className="collapse navbar-collapse" id="navbarNav">
                    {userData.role === "Super Admin" ? (
                      <>
                        <ul className="navbar-nav mr-auto">
                          <li className="nav-item">
                            <Link className="nav-link" to="/caja">
                              Caja
                            </Link>
                          </li>
                          <li className="nav-item">
                            <Link className="nav-link" to="/tramites">
                              Tramite
                            </Link>
                          </li>
                        </ul>
                        <ul className="navbar-nav ml-auto">
                          <li className="nav-item">
                            <Link className="nav-link" to="/usuarios">
                              Usuario
                            </Link>
                          </li>
                          <li className="nav-item">
                            <Link className="nav-link" to="/alumnos">
                              Alumno
                            </Link>
                          </li>

                          <li className="nav-item dropdown">
                            <a
                              //href="/#"
                              className="nav-link dropdown-toggle"
                              data-toggle="dropdown"
                              style={{ cursor: "pointer" }}
                              role="button"
                              aria-haspopup="true"
                              aria-expanded="true"
                              onClick={() => {
                                dropLogin();
                              }}
                            >
                              {userData.nombres}
                            </a>
                            <div
                              className={show}
                              x-placement="bottom-start"
                              style={{
                                display: styleShow,
                                position: "absolute",
                                transform: "translate3d(0px, 38px, 0px)",
                                top: "0px",
                                left: "0px",
                                willChange: "transform",
                              }}
                            >
                              <a
                                className="dropdown-item"
                                style={{
                                  cursor: "pointer",
                                }}
                                onClick={() => {
                                  dropLogin();
                                  history.push("/");
                                }}
                              >
                                {userData.username} - {userData.role}
                              </a>
                              <div className="dropdown-divider" />
                              <a
                                //href="/#"
                                className="dropdown-item"
                                //to="/login"
                                style={{ cursor: "pointer" }}
                                onClick={() => logout()}
                              >
                                Cerrar Sesión
                              </a>
                            </div>
                          </li>
                        </ul>
                      </>
                    ) : (
                      <></>
                    )}
                    {userData.role === "Admin" ? (
                      <>
                        <ul className="navbar-nav mr-auto">
                          <li className="nav-item">
                            <Link className="nav-link" to="/citas">
                              Cita
                            </Link>
                          </li>
                          <li className="nav-item">
                            <Link className="nav-link" to="/egreso">
                              Egreso
                            </Link>
                          </li>
                        </ul>
                        <ul className="navbar-nav ml-auto">
                          <li className="nav-item">
                            <Link className="nav-link" to="/alumnos">
                              Alumno
                            </Link>
                          </li>
                          <li className={showDropdown}>
                            <a
                              className="nav-link dropdown-toggle"
                              data-toggle="dropdown"
                              role="button"
                              aria-haspopup="true"
                              aria-expanded="true"
                              onClick={drop}
                            >
                              Control del Alumno
                            </a>
                            <div
                              className={showDropdownMenu}
                              style={{
                                position: "absolute",
                                transform: "translate3d(0px, 37px, 0px)",
                                top: "0px",
                                left: "0px",
                                willChange: "transform",
                              }}
                              x-placement="bottom-start"
                            >
                              <a
                                className="dropdown-item"
                                style={{ cursor: "pointer" }}
                                onClick={() => {
                                  drop();
                                  history.push("/notasteoricas");
                                }}
                              >
                                Notas teoricas
                              </a>
                              <a
                                style={{ cursor: "pointer" }}
                                className="dropdown-item"
                                onClick={() => {
                                  drop();
                                  history.push("/asistencia");
                                }}
                              >
                                Asistencia teoria y libros
                              </a>
                              <a
                                style={{ cursor: "pointer" }}
                                className="dropdown-item"
                                onClick={() => {
                                  drop();
                                  history.push("/horariopracticas");
                                }}
                              >
                                Practicas horario
                              </a>
                            </div>
                          </li>
                          <li className="nav-item dropdown">
                            <a
                              //href="/#"
                              className="nav-link dropdown-toggle"
                              data-toggle="dropdown"
                              style={{ cursor: "pointer" }}
                              role="button"
                              aria-haspopup="true"
                              aria-expanded="true"
                              onClick={() => {
                                dropLogin();
                              }}
                            >
                              {userData.nombres}
                            </a>
                            <div
                              className={show}
                              x-placement="bottom-start"
                              style={{
                                display: styleShow,
                                position: "absolute",
                                transform: "translate3d(0px, 38px, 0px)",
                                top: "0px",
                                left: "0px",
                                willChange: "transform",
                              }}
                            >
                              <a
                                className="dropdown-item"
                                style={{
                                  cursor: "pointer",
                                }}
                                onClick={() => {
                                  dropLogin();
                                  history.push("/");
                                }}
                              >
                                {userData.username} - {userData.role}
                              </a>
                              <div className="dropdown-divider" />
                              <a
                                //href="/#"
                                className="dropdown-item"
                                //to="/login"
                                style={{ cursor: "pointer" }}
                                onClick={() => logout()}
                              >
                                Cerrar Sesión
                              </a>
                            </div>
                          </li>
                        </ul>
                      </>
                    ) : (
                      <></>
                    )}
                    {userData.role === "Profesor" ? (
                      <>
                        <ul className="navbar-nav ml-auto">
                          <li className="nav-item">
                            <Link className="nav-link" to="/alumnos">
                              Alumno
                            </Link>
                          </li>

                          <li className="nav-item dropdown">
                            <a
                              //href="/#"
                              className="nav-link dropdown-toggle"
                              data-toggle="dropdown"
                              style={{ cursor: "pointer" }}
                              role="button"
                              aria-haspopup="true"
                              aria-expanded="true"
                              onClick={() => {
                                dropLogin();
                              }}
                            >
                              {userData.nombres}
                            </a>
                            <div
                              className={show}
                              x-placement="bottom-start"
                              style={{
                                display: styleShow,
                                position: "absolute",
                                transform: "translate3d(0px, 38px, 0px)",
                                top: "0px",
                                left: "0px",
                                willChange: "transform",
                              }}
                            >
                              <a
                                className="dropdown-item"
                                style={{
                                  cursor: "pointer",
                                }}
                                onClick={() => {
                                  dropLogin();
                                  history.push("/");
                                }}
                              >
                                {userData.username} - {userData.role}
                              </a>
                              <div className="dropdown-divider" />
                              <a
                                //href="/#"
                                className="dropdown-item"
                                //to="/login"
                                style={{ cursor: "pointer" }}
                                onClick={() => logout()}
                              >
                                Cerrar Sesión
                              </a>
                            </div>
                          </li>
                        </ul>
                      </>
                    ) : (
                      <></>
                    )}
                    {userData.role === "Estudiante" ? (
                      <>
                        <ul className="navbar-nav ml-auto">
                          <li className="nav-item">
                            <Link className="nav-link" to="/informacion">
                              Información académica
                            </Link>
                          </li>

                          <li className="nav-item dropdown">
                            <a
                              //href="/#"
                              className="nav-link dropdown-toggle"
                              data-toggle="dropdown"
                              style={{ cursor: "pointer" }}
                              role="button"
                              aria-haspopup="true"
                              aria-expanded="true"
                              onClick={() => {
                                dropLogin();
                              }}
                            >
                              {userData.nombres}
                            </a>
                            <div
                              className={show}
                              x-placement="bottom-start"
                              style={{
                                display: styleShow,
                                position: "absolute",
                                transform: "translate3d(0px, 38px, 0px)",
                                top: "0px",
                                left: "0px",
                                willChange: "transform",
                              }}
                            >
                              <a
                                className="dropdown-item"
                                style={{
                                  cursor: "pointer",
                                }}
                                onClick={() => {
                                  dropLogin();
                                  history.push("/");
                                }}
                              >
                                {userData.username} - {userData.role}
                              </a>
                              <div className="dropdown-divider" />
                              <a
                                //href="/#"
                                className="dropdown-item"
                                //to="/login"
                                style={{ cursor: "pointer" }}
                                onClick={() => logout()}
                              >
                                Cerrar Sesión
                              </a>
                            </div>
                          </li>
                        </ul>
                      </>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Navbar;
