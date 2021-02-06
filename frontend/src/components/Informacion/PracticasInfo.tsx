import React, { useState, useCallback, useContext, useEffect } from "react";
import { GoArrowLeft } from "react-icons/go";
import PracticasItem from "./../HorarioPracticas/PracticaItem";
import { Practicas } from "./../HorarioPracticas/Practicas";
import * as practicasService from "../HorarioPracticas/PracticasService";
import { UserContext } from "../Context/UserContext";
import MostarSesionTerminada from "../lib/SesionTerminada";

interface Props {
  setActivatePrincipal: (statud: boolean) => void;
  setIsActivatePractica: (statud: boolean) => void;
}

const InfoPractica = (props: Props) => {
  const { setActivatePrincipal, setIsActivatePractica } = props;
  const [listPracticas, setListPracticas] = useState<Practicas[]>([]);
  const { userData }: any = useContext(UserContext);

  const loadPracticas = useCallback(async () => {
    const res = await practicasService.getPracticasXAlumno(userData.id);
    setListPracticas(res.data);
  }, [userData.id]);

  useEffect(() => {
    loadPracticas();
  }, [loadPracticas]);

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
                  setIsActivatePractica(false);
                }}
              />{" "}
              Practicas - Horario
            </div>
            <div className="card-body">
              <div className="table-responsive">
                {listPracticas.length === 0 ? (
                  <>No hay practicas publicadas.</>
                ) : (
                  <>
                    <table className="table table-bordered">
                      <thead className="table-info">
                        <tr>
                          <th scope="col">NRO</th>
                          <th scope="col">Profesor</th>
                          <th scope="col">Fecha</th>
                          <th scope="col">Hora Inicio</th>
                          <th scope="col">Hora termino</th>
                          <th scope="col">Alumno</th>
                        </tr>
                      </thead>
                      <tbody className="table-light">
                        {listPracticas.map((practica) => (
                          <PracticasItem
                            practica={practica}
                            key={practica._id}
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
export default InfoPractica;
