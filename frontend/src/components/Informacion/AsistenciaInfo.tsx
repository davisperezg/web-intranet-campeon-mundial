import React, { useContext, useState, useCallback, useEffect } from "react";
import { GoArrowLeft } from "react-icons/go";
import { Asistencia } from "../Asistencia/Asistencia";
import AsistenciaItem from "./../Asistencia/AsistenciaItem";
import * as asistenciaService from "./../Asistencia/AsistenciaService";
import { UserContext } from "../Context/UserContext";
import MostarSesionTerminada from "../lib/SesionTerminada";

interface Props {
  setActivatePrincipal: (statud: boolean) => void;
  setIsActivateAsistencia: (statud: boolean) => void;
}

const InfoAsistencia = (props: Props) => {
  const { setActivatePrincipal, setIsActivateAsistencia } = props;
  const [listAsistencias, setListAsistencia] = useState<Asistencia[]>([]);
  const { userData }: any = useContext(UserContext);

  const loadAsistencias = useCallback(async () => {
    const res = await asistenciaService.getAsistenciaXAlumno(userData.id);

    setListAsistencia(res.data);
  }, [userData.id]);

  useEffect(() => {
    loadAsistencias();
  }, [loadAsistencias]);

  return (
    <>
      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="card-header">
              <GoArrowLeft
                style={{
                  cursor: "pointer",
                  fontSize: "20px",
                }}
                onClick={() => {
                  setActivatePrincipal(true);
                  setIsActivateAsistencia(false);
                }}
              />{" "}
              Asistencia teoria y libros
            </div>
            <div className="card-body">
              <div
                className="table-responsive"
                style={{ border: "1px solid #444" }}
              >
                {listAsistencias.length === 0 ? (
                  <>No hay practicas publicadas.</>
                ) : (
                  <>
                    <table className="table table-bordered">
                      <thead className="table-light">
                        <tr>
                          <th scope="col">Fecha y hora de ingreso</th>
                          <th scope="col">Fecha y hora de salida</th>
                          <th scope="col">Alumno</th>
                          <th scope="col">Capitulo</th>
                        </tr>
                      </thead>
                      <tbody className="table-light">
                        {listAsistencias.map((asistencia) => (
                          <AsistenciaItem
                            asistencia={asistencia}
                            key={asistencia._id}
                          />
                        ))}
                      </tbody>
                    </table>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default InfoAsistencia;
