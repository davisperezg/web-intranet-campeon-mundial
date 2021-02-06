import React, { useState, useEffect, useContext } from "react";
import { GoArrowLeft } from "react-icons/go";
import { useHistory, useParams } from "react-router-dom";
import { Alumno } from "../Alumnos/Alumno";
import * as adminService from "./UsuariosService";
import moment from "moment";
import { UserContext } from "../Context/UserContext";
import MostarSesionTerminada from "../lib/SesionTerminada";

interface Params {
  id?: string;
}

const AdministradorInfo = () => {
  const history = useHistory();
  const params = useParams<Params>();
  const [admin, setAdmin]: any = useState<Alumno[]>([]);
  const { userData }: any = useContext(UserContext);

  const getAdmin = async (id: string) => {
    const res: any = await adminService.getAdministrador(id);
    const {
      _id,
      nro,
      nombres,
      username,
      email,
      dni,
      cellphone,
      startClasses,
      endClasses,
      createdAt,
      updatedAt,
      address,
      telephone,
    } = res.data;
    setAdmin({
      _id,
      nro,
      nombres,
      username,
      email,
      password: "",
      dni,
      cellphone,
      startClasses,
      endClasses,
      sedes: res.data.sedes[0].name,
      roles: res.data.roles[0].name,
      createdAt,
      updatedAt,
      address,
      telephone,
    });
  };
  useEffect(() => {
    if (params.id) getAdmin(params.id);
  }, [params.id]);

  return (
    <div className="row">
      <div className="col-md-12">
        <div className="card my-auto">
          <GoArrowLeft
            className="offset-md-11 offset-sm-11"
            onClick={() => {
              history.push("/usuarios");
            }}
            style={{
              cursor: "pointer",
              fontSize: "20px",
              position: "absolute",
              top: "10px",
              marginLeft: "95%",
            }}
          />
          <div className="card-body ">
            <h4>
              USUARIO {admin.nombres}
              {admin.nro <= 9 ? `0${admin.nro}` : admin.nro}
            </h4>
            <hr />
            <div className="row justify-content-start">
              <div className="col-4">
                <strong>Contacto</strong>
                <br />
                <br />
                {!admin.telephone ? (
                  <div>
                    {admin.email}
                    <br />
                    {admin.cellphone}
                    <br />
                  </div>
                ) : (
                  <div>
                    {admin.email}
                    <br />
                    {admin.cellphone}
                    <br />
                    {admin.telephone}
                  </div>
                )}
              </div>
              <div className="col-2">
                <strong>Sede</strong>
                <br />
                <br />
                {admin.sedes}
              </div>
              <div className="col-2">
                <strong>Rol</strong>
                <br />
                <br />
                {admin.roles}
              </div>
              {userData.nivel === 2 ? <></> : <></>}
              {userData.nivel === 1 ? (
                <>
                  <div className="col-2">
                    <a
                      style={{ cursor: "pointer", color: "blue" }}
                      onClick={() =>
                        history.push(`/usuarios/registro/${admin._id}`)
                      }
                    >
                      Editar
                    </a>
                  </div>
                </>
              ) : (
                <></>
              )}
            </div>
            <hr />
            <div className="row justify-content-start">
              <div className="col-12">
                {!admin.address ? (
                  <>
                    <strong>Usuario creado el </strong>
                    {moment(admin.createdAt).format("DD/MM/YYYY")}
                    <br />
                    <strong>
                      El usuario o administrador modificó sus datos el{" "}
                    </strong>
                    {moment(admin.updatedAt).format("DD/MM/YYYY")}
                  </>
                ) : (
                  <>
                    <strong>Dirección</strong>
                    <br />
                    <br />
                    {admin.address}
                    <hr />
                    <strong>Usuario creado el </strong>
                    {moment(admin.createdAt).format("DD/MM/YYYY")}
                    <br />
                    <strong>
                      El usuario o administrador modificó sus datos el{" "}
                    </strong>
                    {moment(admin.updatedAt).format("DD/MM/YYYY")}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdministradorInfo;
