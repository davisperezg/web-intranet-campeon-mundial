/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect, useContext, KeyboardEvent } from "react";
import { Alumno } from "./Alumno";
import * as alumnoService from "./AlumnoService";
import AlumnosItem from "./AlumnosItem";
import { useHistory } from "react-router-dom";
import { UserContext } from "../Context/UserContext";
import AlumnosListDeudores from "./AlumnosListDeudores";
import MostarSesionTerminada from "./../lib/SesionTerminada";

const AlumnosList = () => {
  const [loading, setLoading] = useState<Boolean>(true);

  const [alumnos, setAlumnos] = useState<Alumno[]>([]);
  const { userData }: any = useContext(UserContext);
  const [totalAlumnos, setTotalAlumnos] = useState<Number>(0);
  const history = useHistory();
  const [filtro, setFiltro] = useState({
    deudores: "",
  });
  const onKeyUpValue = async (event: KeyboardEvent<HTMLInputElement>) => {
    const { value }: any = event.target;
    const res = await alumnoService.getAlumnos();
    const buscarAlumnos = res.data.filter(
      (alumno: any) =>
        alumno.nombres.toLowerCase().indexOf(value) >= 0 ||
        alumno.nombres.toUpperCase().indexOf(value) >= 0 ||
        alumno.username.toLowerCase().indexOf(value) >= 0 ||
        alumno.username.toUpperCase().indexOf(value) >= 0 ||
        String(alumno.nro).toLowerCase().indexOf(value) >= 0 ||
        String(alumno.nro).toUpperCase().indexOf(value) >= 0 ||
        String(alumno.sedes[0].name.toLowerCase()).indexOf(value) >= 0 ||
        String(alumno.sedes[0].name.toUpperCase()).indexOf(value) >= 0 ||
        String(alumno.dni).toLowerCase().indexOf(value) >= 0 ||
        String(alumno.dni).toUpperCase().indexOf(value) >= 0
    );
    const cantidadAlumnos = buscarAlumnos.length;
    setTotalAlumnos(cantidadAlumnos);
    if (buscarAlumnos.length === 0) {
      console.log("Buscando alumnos...");
    } else {
      setAlumnos(buscarAlumnos);
    }
  };

  const handleCheckedChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFiltro({ ...filtro, [e.target.name]: e.target.checked });
  };

  const loadAlumnos = async () => {
    try {
      const res = await alumnoService.getAlumnos();
      const formatedVideos = res.data
        .map((alumno) => {
          return {
            ...alumno,
            createdAt: alumno.createdAt
              ? new Date(alumno.createdAt)
              : new Date(),
            updatedAt: alumno.updatedAt
              ? new Date(alumno.updatedAt)
              : new Date(),
          };
        })
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      setTotalAlumnos(formatedVideos.length);
      setAlumnos(formatedVideos);
      setLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    loadAlumnos();
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

  if (alumnos.length === 0)
    return (
      <div>
        No hay alumnos publicados.{" "}
        <a
          style={{ cursor: "pointer", color: "red" }}
          onClick={() => {
            history.push("/alumnos/registro");
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
              Matriculas
              {userData.role === "Profesor" ? (
                <></>
              ) : (
                <>
                  <a
                    style={{ float: "right", color: "blue", cursor: "pointer" }}
                    onClick={() => {
                      history.push("/alumnos/registro");
                    }}
                  >
                    Nueva matricula
                  </a>
                </>
              )}
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-sm-8">
                  <input
                    type="text"
                    autoFocus
                    onKeyUp={onKeyUpValue}
                    placeholder="Puede buscar alumno o ficha por username, codigo, nombres, sede, tramite o dni"
                    className="form-control"
                  />
                </div>
                {userData.role === "Profesor" ? (
                  ""
                ) : (
                  <div className="col-sm-2">
                    <div className="form-check">
                      <label className="form-check-label">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="deudores"
                          onChange={handleCheckedChange}
                          value={filtro.deudores}
                        />
                        Calcular monto deudores
                      </label>
                    </div>
                  </div>
                )}
                {filtro.deudores ? (
                  ""
                ) : (
                  <div className="col-sm-2">
                    <strong style={{ float: "right" }}>
                      Total de alumnos {totalAlumnos}
                    </strong>
                  </div>
                )}
              </div>
              <br />

              {filtro.deudores ? (
                <>
                  <AlumnosListDeudores busqueda={Boolean(filtro.deudores)} />
                </>
              ) : (
                <>
                  <div className="table-responsive">
                    <table className="table table-bordered">
                      <thead className="table-active">
                        <tr>
                          <th scope="col">Username</th>
                          <th scope="col">COD</th>
                          <th scope="col">Alumno</th>
                          <th scope="col">Sede</th>
                          <th scope="col">D.N.I</th>
                          <th scope="col">Fecha Creada</th>
                          <th scope="col">Fecha Actualizada</th>
                          <th scope="col">Acciones</th>
                        </tr>
                      </thead>
                      <tbody className="table-light">
                        {alumnos.map((alumno) => (
                          <AlumnosItem
                            alumno={alumno}
                            key={alumno._id}
                            loadAlumnos={loadAlumnos}
                          />
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AlumnosList;
