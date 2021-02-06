import React, { useEffect, useState, useContext, useCallback } from "react";
import { GoArrowLeft } from "react-icons/go";
import { NotasTeoricas } from "./../Notas/NotasTeoricas";
import * as notasService from "../Notas/NotasService";
import { UserContext } from "../Context/UserContext";
import InfoNotaAlumnoItem from "./NotasTeoriasItem";
import InfoNotaAlumnoItemSegundaOportunidad from "./NotasTeoriasItemSegundaOportunidad";
import MostarSesionTerminada from "../lib/SesionTerminada";

interface Props {
  setActivatePrincipal: (statud: boolean) => void;
  setIsActivateNotas: (statud: boolean) => void;
}

const InfoNotasTeoricas = (props: Props) => {
  const { setActivatePrincipal, setIsActivateNotas } = props;
  const { userData, setUserData }: any = useContext(UserContext);
  const [notas, setNotas] = useState<NotasTeoricas[]>([]);
  const [notasSegundaOportunidad, setNotasSegundaOportunidad] = useState<
    NotasTeoricas[]
  >([]);

  //const [loading, setLoading] = useState(true);

  const loadDataAlumno = useCallback(async () => {
    const res = await notasService.getNotasXAlumnos(userData.id);
    //setLoading(false);
    setNotas(res.data);
  }, [userData.id]);

  /**
  *  const loadPromedio = useCallback(async () => {
    const res1ero = await notasService.getNotasXAlumnos(userData.id);
    const res2do = await notasService.getNotasXAlumnosS(userData.id);
    const recorre1ero = res1ero.data.map((notas: any) => notas.nota);
    const recorre2do = res2do.data.map((notas: any) => notas.nota);
    const suma1ero = recorre1ero.reduce((a, b) => a + b, 0);
    const suma2do = recorre2do.reduce((a, b) => a + b, 0);
    const promedio =
      (suma1ero + suma2do) / (recorre1ero.length + recorre2do.length);
    setPromedio(promedio);
  }, [userData.id]);
  * 
  */

  const loadDataAlumnoSegundaOportunidad = useCallback(async () => {
    const res = await notasService.getNotasXAlumnosS(userData.id);
    setNotasSegundaOportunidad(res.data);
  }, [userData.id]);

  useEffect(() => {
    loadDataAlumno();
    loadDataAlumnoSegundaOportunidad();
    //loadPromedio();
  }, [loadDataAlumno, loadDataAlumnoSegundaOportunidad]);
  //loadPromedio

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
                  setIsActivateNotas(false);
                }}
              />{" "}
              Notas teoria
            </div>
            <div className="card-body">
              {notas.length === 0 && notasSegundaOportunidad.length === 0 ? (
                <>No tiene notas registradas</>
              ) : (
                <>
                  <strong>
                    <span>Notas Primer intento</span>
                  </strong>
                  <hr></hr>
                  {notas.map((nota) => (
                    <InfoNotaAlumnoItem key={nota._id} nota={nota} />
                  ))}

                  {notasSegundaOportunidad.length === 0 ? (
                    <></>
                  ) : (
                    <>
                      <br />
                      <strong>
                        <span>Notas Segundo intento</span>
                      </strong>
                      <hr></hr>
                      {notasSegundaOportunidad.map((nota) => (
                        <InfoNotaAlumnoItemSegundaOportunidad
                          key={nota._id}
                          nota={nota}
                        />
                      ))}
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default InfoNotasTeoricas;
