import React, { useState, useEffect, useContext, KeyboardEvent } from "react";
import { Alumno } from "../Alumnos/Alumno";
import { useHistory } from "react-router-dom";
import * as adminService from "./UsuariosService";
import AdminItem from "./UsuariosItem";
import MostarSesionTerminada from "../lib/SesionTerminada";
import { UserContext } from "../Context/UserContext";

const AdministradoresList = () => {
  const [loading, setLoading] = useState(true);
  const [admins, setAdmin] = useState<Alumno[]>([]);
  const history = useHistory();
  const [totalUsuarios, setTotalUsuarios] = useState<Number>(0);
  const { userData, setUserData }: any = useContext(UserContext);

  const loadAdmin = async () => {
    const res = await adminService.getAdministradores();
    const formatedVideos = res.data
      .map((admin) => {
        return {
          ...admin,
          createdAt: admin.createdAt ? new Date(admin.createdAt) : new Date(),
          updatedAt: admin.updatedAt ? new Date(admin.updatedAt) : new Date(),
        };
      })
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    const soloUsers = formatedVideos.filter(
      (element: any) =>
        element.roles[0].name === "Super Admin" ||
        element.roles[0].name === "Admin" ||
        element.roles[0].name === "Profesor"
    );
    setTotalUsuarios(soloUsers.length);
    setAdmin(formatedVideos);
    setLoading(false);
  };

  const onKeyUpValue = async (event: KeyboardEvent<HTMLInputElement>) => {
    const { value }: any = event.target;
    const res = await adminService.getAdministradores();
    const buscarUsuarios = res.data.filter(
      (admin: any) =>
        admin.nombres.toLowerCase().indexOf(value) >= 0 ||
        admin.nombres.toUpperCase().indexOf(value) >= 0 ||
        admin.username.toLowerCase().indexOf(value) >= 0 ||
        admin.username.toUpperCase().indexOf(value) >= 0 ||
        String(admin.roles[0].name.toLowerCase()).indexOf(value) >= 0 ||
        String(admin.roles[0].name.toUpperCase()).indexOf(value) >= 0 ||
        String(admin.sedes[0].name.toLowerCase()).indexOf(value) >= 0 ||
        String(admin.sedes[0].name.toUpperCase()).indexOf(value) >= 0 ||
        admin.dni.toLowerCase().indexOf(value) >= 0 ||
        admin.dni.toUpperCase().indexOf(value) >= 0
    );
    const soloUsers = buscarUsuarios.filter(
      (element: any) =>
        element.roles[0].name === "Super Admin" ||
        element.roles[0].name === "Admin" ||
        element.roles[0].name === "Profesor"
    );
    const cantidadUsuarios = soloUsers.length;
    setTotalUsuarios(cantidadUsuarios);

    if (buscarUsuarios.length === 0) {
      console.log("Buscando alumnos...");
    } else {
      setAdmin(buscarUsuarios);
    }
  };

  useEffect(() => {
    loadAdmin();
  }, []);

  if (loading)
    return (
      <div className="row">
        <div className="col-md-12 my-auto">
          <div className="spinner-grow text-primary" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      </div>
    );

  if (admins.length === 0)
    return (
      <div>
        No hay alumnos publicados.{" "}
        <a
          style={{ cursor: "pointer", color: "red" }}
          onClick={() => {
            history.push("/usuarios/registro");
          }}
        >
          Registre aqui
        </a>
      </div>
    );

  return (
    <>
      <div className="row">
        <div className="col-sm-12">
          <div className="card">
            <div className="card-header">
              Usuarios{" "}
              <a
                style={{ float: "right", color: "blue", cursor: "pointer" }}
                onClick={() => {
                  history.push("/usuarios/registro");
                }}
              >
                Añadir usuario
              </a>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-sm-8">
                  <input
                    type="text"
                    autoFocus
                    onKeyUp={onKeyUpValue}
                    placeholder="Puede buscar por username, rol, nombres, sede o dni"
                    className="form-control"
                  />
                </div>
                <div className="col-sm-4">
                  <strong style={{ float: "right" }}>
                    Total de usuarios {totalUsuarios}
                  </strong>
                </div>
              </div>
              <br />

              <div className="table-responsive">
                <table className="table table-bordered">
                  <thead className="table-primary">
                    <tr>
                      <th scope="col">Username</th>
                      <th scope="col">Rol</th>
                      <th scope="col">Nombres</th>
                      <th scope="col">Sede</th>

                      <th scope="col">D.N.I</th>
                      <th scope="col">Fecha Creada</th>
                      <th scope="col">Fecha Actualizada</th>
                      <th scope="col">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="table-light">
                    {admins.map((admin) => (
                      <AdminItem
                        admin={admin}
                        key={admin._id}
                        loadAdmin={loadAdmin}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdministradoresList;
