import React from "react";
import { NotasPracticaManejo } from "../NotasPracticasManejo/NotasPracticasManejo";

interface Props {
  nota: NotasPracticaManejo;
}

const InfoNotaPracticaAlumnoItem = (props: Props) => {
  const { nota } = props;
  return (
    <>
      <div style={{ border: "1px solid", color: "444" }} key={nota._id}>
        <span>{nota.etapa}</span> :{" "}
        {nota.estadoAlumno === "APROBADO" ? (
          <>
            <strong>
              <span
                style={{ color: "green", float: "right", marginRight: "5px" }}
              >
                {nota.estadoAlumno}
              </span>
            </strong>
          </>
        ) : (
          <>
            <strong>
              <span
                style={{ color: "red", float: "right", marginRight: "5px" }}
              >
                {nota.estadoAlumno}
              </span>
            </strong>
          </>
        )}
        <br />
      </div>
    </>
  );
};

export default InfoNotaPracticaAlumnoItem;
