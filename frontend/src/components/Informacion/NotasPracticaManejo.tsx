import React, { useState, useContext, useCallback, useEffect } from "react";
import { NotasPracticaManejo } from "./../NotasPracticasManejo/NotasPracticasManejo";
import * as practicasManejoService from "../NotasPracticasManejo/NotasPracticaManejoService";
import { UserContext } from "../Context/UserContext";
import { GoArrowLeft } from "react-icons/go";
import InfoNotaPracticaAlumnoItem from "./NotasPracticaManejoItem";
import MostarSesionTerminada from "../lib/SesionTerminada";

interface Props {
  setActivatePrincipal: (statud: boolean) => void;
  setIsActivatePracticaManejo: (statud: boolean) => void;
}

const NotasPracticaManejoInfo = (props: Props) => {
  const { setActivatePrincipal, setIsActivatePracticaManejo } = props;
  const [listPracticas, setListPracticas] = useState<NotasPracticaManejo[]>([]);
  const { userData }: any = useContext(UserContext);

  const loadPracticas = useCallback(async () => {
    const res = await practicasManejoService.getNotasPracticaXAlumno(
      userData.id
    );
    console.log(res.data);
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
                  setIsActivatePracticaManejo(false);
                }}
              />{" "}
              Estado nota de manejo
            </div>
            <div className="card-body">
              <div className="table-responsive">
                {listPracticas.length === 0 ? (
                  <>No hay practicas publicadas.</>
                ) : (
                  <>
                    {listPracticas.map((practica) => (
                      <InfoNotaPracticaAlumnoItem
                        nota={practica}
                        key={practica._id}
                      />
                    ))}
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

export default NotasPracticaManejoInfo;
