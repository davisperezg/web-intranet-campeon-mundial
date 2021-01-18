import React, { useState } from "react";
import { Link } from "react-router-dom";
import { GoArrowLeft } from "react-icons/go";
import InfoNotasTeoricas from "./NotasTeoricasInfo";
import InfoAsistencia from "./AsistenciaInfo";
import InfoPractica from "./PracticasInfo";
import NotasPracticaManejoInfo from "./NotasPracticaManejo";

const InformacionIndex = () => {
  const [isActivatePrincipal, setActivatePrincipal] = useState<Boolean>(true);

  const [isActiveNotas, setIsActivateNotas] = useState<Boolean>(false);
  const [isActiveAsistencia, setIsActivateAsistencia] = useState<Boolean>(
    false
  );
  const [isActivePractica, setIsActivatePractica] = useState<Boolean>(false);

  const [
    isActivePracticaManejo,
    setIsActivatePracticaManejo,
  ] = useState<Boolean>(false);

  return (
    <>
      {isActivatePrincipal ? (
        <>
          <ul>
            <li>
              <a
                onClick={() => {
                  setActivatePrincipal(false);
                  setIsActivateNotas(true);
                }}
                style={{ cursor: "pointer" }}
              >
                Notas teoricas
              </a>
            </li>
            <li>
              <a
                onClick={() => {
                  setActivatePrincipal(false);
                  setIsActivateAsistencia(true);
                }}
                style={{ cursor: "pointer" }}
              >
                Asistencia teoria y libros
              </a>
            </li>
            <li>
              <a
                onClick={() => {
                  setActivatePrincipal(false);
                  setIsActivatePractica(true);
                }}
                style={{ cursor: "pointer" }}
              >
                Practicas - Horario
              </a>
            </li>
            <li>
              <a
                onClick={() => {
                  setActivatePrincipal(false);
                  setIsActivatePracticaManejo(true);
                }}
                style={{ cursor: "pointer" }}
              >
                Notas de Practicas de Manejo
              </a>
            </li>
          </ul>
        </>
      ) : (
        <>
          {isActiveNotas ? (
            <>
              <InfoNotasTeoricas
                key={""}
                setIsActivateNotas={setIsActivateNotas}
                setActivatePrincipal={setActivatePrincipal}
              />
            </>
          ) : (
            <></>
          )}
          {isActiveAsistencia ? (
            <>
              <InfoAsistencia
                key={""}
                setIsActivateAsistencia={setIsActivateAsistencia}
                setActivatePrincipal={setActivatePrincipal}
              />
            </>
          ) : (
            <></>
          )}

          {isActivePractica ? (
            <>
              <InfoPractica
                key={""}
                setIsActivatePractica={setIsActivatePractica}
                setActivatePrincipal={setActivatePrincipal}
              />
            </>
          ) : (
            <></>
          )}
          {isActivePracticaManejo ? (
            <>
              <NotasPracticaManejoInfo
                key={""}
                setIsActivatePracticaManejo={setIsActivatePracticaManejo}
                setActivatePrincipal={setActivatePrincipal}
              />
            </>
          ) : (
            <></>
          )}
        </>
      )}
    </>
  );
};

export default InformacionIndex;
