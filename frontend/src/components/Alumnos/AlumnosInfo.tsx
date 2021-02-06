import React, { useState, useContext, useEffect } from "react";
import { GoArrowLeft } from "react-icons/go";
import { useHistory, useParams } from "react-router-dom";
import { Alumno } from "./Alumno";
import * as alumnoService from "./AlumnoService";
import moment from "moment";
import { UserContext } from "../Context/UserContext";
import MostarSesionTerminada from "../lib/SesionTerminada";

interface Params {
  id?: string;
}

const AlumnoInfo = () => {
  const { userData }: any = useContext(UserContext);

  const history = useHistory();
  const params = useParams<Params>();
  const [alumno, setAlumno]: any = useState<Alumno[]>([]);

  const getAlumno = async (id: string) => {
    const res: any = await alumnoService.getAlumno(id);
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
      registrador,
    } = res.data;
    setAlumno({
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
      createdAt,
      updatedAt,
      address,
      telephone,
      registrador,
    });
  };
  useEffect(() => {
    if (params.id) getAlumno(params.id);
  }, [params.id]);

  return (
    <div className="row">
      <div className="col-md-12">
        <div className="card my-auto">
          <GoArrowLeft
            className="offset-md-11 offset-sm-11"
            onClick={() => {
              history.push("/alumnos");
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
              ALUMNO {alumno.nombres} - MATRICULA{" "}
              {alumno.nro <= 9 ? `0${alumno.nro}` : alumno.nro}
            </h4>
            <hr />
            <div className="row justify-content-start">
              <div className="col-4">
                <strong>Contacto</strong>
                <br />
                <br />
                {!alumno.telephone ? (
                  <div>
                    {alumno.email}
                    <br />
                    {alumno.cellphone}
                    <br />
                  </div>
                ) : (
                  <div>
                    {alumno.email}
                    <br />
                    {alumno.cellphone}
                    <br />
                    {alumno.telephone}
                  </div>
                )}
              </div>
              <div className="col-2">
                <strong>Sede</strong>
                <br />
                <br />
                {alumno.sedes}
              </div>
              {/**
                 * <div className="col-2">
                <strong>Tramite</strong>
                <br />
                <br />
                {alumno.tramites}
              </div>
                 */}
              {alumno.startClasses && alumno.endClasses ? (
                <>
                  <div className="col-2">
                    <strong>Inicio de clases</strong>
                    <br />
                    {moment(alumno.startClasses).format("DD/MM/YYYY")}
                    <br />
                    <strong>Fin de clases</strong>
                    <br />
                    {moment(alumno.endClasses).format("DD/MM/YYYY")}
                  </div>
                  <div className="col-2">
                    {userData.role === "Profesor" ? (
                      <></>
                    ) : (
                      <>
                        <a
                          style={{ cursor: "pointer", color: "blue" }}
                          onClick={() =>
                            history.push(`/alumnos/registro/${alumno._id}`)
                          }
                        >
                          Editar
                        </a>
                      </>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="col-2">
                    {userData.role === "Profesor" ? (
                      <></>
                    ) : (
                      <>
                        <a
                          style={{ cursor: "pointer", color: "blue" }}
                          onClick={() =>
                            history.push(`/alumnos/registro/${alumno._id}`)
                          }
                        >
                          Editar
                        </a>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
            <hr />
            <div>
              <strong>Código alumno</strong>
              <br />
              <br />
              {alumno.username}
            </div>
            <hr />
            <div>
              {!alumno.address ? (
                <div>
                  <strong>Usuario creado el </strong>
                  {moment(alumno.createdAt).format("DD/MM/YYYY")}
                  <br />
                  <strong>
                    El usuario o administrador modificó sus datos el{" "}
                  </strong>
                  {moment(alumno.updatedAt).format("DD/MM/YYYY")}
                </div>
              ) : (
                <div>
                  <strong>Dirección</strong>
                  <br />
                  <br />
                  {alumno.address}
                  <hr />
                  <strong>Usuario creado el </strong>
                  {moment(alumno.createdAt).format("DD/MM/YYYY")}
                  <br />
                  <strong>
                    El usuario o administrador modificó sus datos el{" "}
                  </strong>
                  {moment(alumno.updatedAt).format("DD/MM/YYYY")}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlumnoInfo;
