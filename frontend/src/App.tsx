import React, { useState, useEffect, createElement, useCallback } from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import "bootswatch/dist/pulse/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import "animate.css/animate.min.css";
import "./index.css";

import Navbar from "./components/Navbar/Navbar";
import VideoList from "./components/Videos/VideoList";
import VideoForm from "./components/Videos/VideoForm";
import LoginForm from "./components/Login/LoginForm";
import AdministradoresList from "./components/Administradores/UsuariosList";
import UsuariosForm from "./components/Administradores/UsuariosForm";
import AlumnosForm from "./components/Alumnos/AlumnosForm";
import AlumnosInfo from "./components/Alumnos/AlumnosInfo";
import AlumnosList from "./components/Alumnos/AlumnosList";
import SedesForm from "./components/Sedes/SedesForm";
import SedesList from "./components/Sedes/SedesList";
import { getToken } from "./components/Helpers/AuthToken";
import { ToastContainer } from "react-toastify";
import { UserProvider } from "./components/Context/UserContext";
import axios from "axios";
import * as userService from "./components/Users/UserService";
import AdministradorInfo from "./components/Administradores/UsuariosInfo";
import TramiteForm from "./components/Tramites/TramitesForm";
import TramiteList from "./components/Tramites/TramitesList";
import PagosList from "./components/Pagos/PagosList";
import DocumentosList from "./components/Documentos/DocumentosList";
import NotasForm from "./components/Notas/NotasForm";
import AsistenciaForm from "./components/Asistencia/AsistenciaForm";
import HorarioForm from "./components/HorarioPracticas/HorarioForm";
import InformacionIndex from "./components/Informacion/InformacionIndex";
import EgresoList from "./components/Egreso/EgresoList";
import EgresoForm from "./components/Egreso/EgresoForm";
import CajaList from "./components/Caja/CajaList";
import CitaList from "./components/Cita/CitaList";
import CitaForm from "./components/Cita/CitaForm";
import NotasFormPM from "./components/NotasPracticasManejo/NotaFormPM";
import Principal from "./components/Principal/Principal";

//axios.defaults.baseURL = `${process.env.REACT_APP_API}/`;

const PrivateRoute = ({ component, ...rest }: any) => {
  const routeComponent = (props: any) =>
    getToken() ? (
      createElement(component, props)
    ) : (
      <Redirect to={{ pathname: "/login" }} />
    );
  //console.log(isAuthenticated);
  return <Route {...rest} render={routeComponent} />;
};

const VerifyTokenLogin = ({ component, ...rest }: any) => {
  const routeComponent = (props: any) =>
    getToken() ? (
      <Redirect to={{ pathname: "/" }} />
    ) : (
      createElement(component, props)
    );
  //console.log(estado);
  return <Route {...rest} render={routeComponent} />;
};
const VerifyTokenDashboard = ({ component, ...rest }: any) => {
  const routeComponent = (props: any) =>
    getToken() ? (
      createElement(component, props)
    ) : (
      <Redirect to={{ pathname: "/login" }} />
    );
  return <Route {...rest} render={routeComponent} />;
};
export default function App() {
  const [userData, setUserData]: any = useState({});

  const cargaUsuario = async () => {
    try {
      const userFound: any = await userService.getData();
      setUserData(userFound.data);
      //setUserData({ ...userData, estado: 1 });
    } catch (e) {
      //setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    if (!getToken()) {
      setUserData({ session: "false" });
      return;
    }
    cargaUsuario();
  }, []);

  return (
    <>
      <React.StrictMode>
        <BrowserRouter>
          <UserProvider value={{ userData, setUserData }}>
            {!getToken() ? (
              <></>
            ) : (
              <>
                <Navbar />
              </>
            )}
            <div className="container p-4">
              <Switch>
                <VerifyTokenLogin exact path="/login" component={LoginForm} />

                <VerifyTokenDashboard exact path="/" component={Principal} />

                <PrivateRoute exact path="/alumnos" component={AlumnosList} />
                <PrivateRoute
                  exact
                  path="/alumnos/registro"
                  component={AlumnosForm}
                />
                <PrivateRoute
                  exact
                  path="/alumnos/registro/:id"
                  component={AlumnosForm}
                />
                <PrivateRoute
                  exact
                  path="/alumnos/info/:id"
                  component={AlumnosInfo}
                />
                <PrivateRoute exact path="/sedes" component={SedesList} />
                <PrivateRoute exact path="/sedes/:id" component={SedesForm} />
                <PrivateRoute exact path="/tramites" component={TramiteList} />
                <PrivateRoute
                  exact
                  path="/tramites/registro"
                  component={TramiteForm}
                />
                <PrivateRoute
                  exact
                  path="/tramites/registro/:id"
                  component={TramiteForm}
                />
                <PrivateRoute
                  exact
                  path="/usuarios"
                  component={AdministradoresList}
                />
                <PrivateRoute
                  exact
                  path="/usuarios/info/:id"
                  component={AdministradorInfo}
                />
                <PrivateRoute
                  exact
                  path="/usuarios/registro"
                  component={UsuariosForm}
                />
                <PrivateRoute
                  exact
                  path="/usuarios/registro/:id"
                  component={UsuariosForm}
                />
                <PrivateRoute exact path="/videos" component={VideoForm} />
                <PrivateRoute exact path="/videos/:id" component={VideoForm} />
                <PrivateRoute
                  exact
                  path="/alumnos/pagos/:id"
                  component={PagosList}
                />
                <PrivateRoute
                  exact
                  path="/alumnos/pagos/:id/pago/:idpago"
                  component={PagosList}
                />

                <PrivateRoute
                  exact
                  path="/alumnos/fecha/documentos/:id"
                  component={DocumentosList}
                />
                <PrivateRoute
                  exact
                  path="/alumnos/fecha/documentos/:id/documento/:iddocumento"
                  component={DocumentosList}
                />
                <PrivateRoute
                  exact
                  path="/notasteoricas"
                  component={NotasForm}
                />
                <PrivateRoute
                  exact
                  path="/asistencia"
                  component={AsistenciaForm}
                />
                <PrivateRoute
                  exact
                  path="/asistencia/:id"
                  component={AsistenciaForm}
                />
                <PrivateRoute
                  exact
                  path="/horariopracticas"
                  component={HorarioForm}
                />
                <PrivateRoute
                  exact
                  path="/horariopracticas/:id"
                  component={HorarioForm}
                />
                <PrivateRoute
                  exact
                  path="/informacion"
                  component={InformacionIndex}
                />
                <PrivateRoute exact path="/egreso" component={EgresoList} />
                <PrivateRoute
                  exact
                  path="/egreso/registro"
                  component={EgresoForm}
                />
                <PrivateRoute exact path="/caja" component={CajaList} />
                <PrivateRoute exact path="/citas" component={CitaList} />
                <PrivateRoute
                  exact
                  path="/citas/registro"
                  component={CitaForm}
                />
                <PrivateRoute
                  exact
                  path="/citas/registro/:id"
                  component={CitaForm}
                />
                <PrivateRoute
                  exact
                  path="/notasmanejo/:id"
                  component={NotasFormPM}
                />
              </Switch>
              <ToastContainer />
            </div>
          </UserProvider>
        </BrowserRouter>
      </React.StrictMode>
    </>
  );
}
