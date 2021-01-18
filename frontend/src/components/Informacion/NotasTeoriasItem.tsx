import React from "react";
import { NotasTeoricas } from "../Notas/NotasTeoricas";

interface Props {
  nota: NotasTeoricas;
}

const InfoNotaAlumnoItem = (props: Props) => {
  const { nota } = props;
  return (
    <>
      <div style={{ border: "1px solid", color: "444" }} key={nota._id}>
        <span>{nota.tipoNota}</span>
        <div style={{ float: "right", marginRight: "10px" }}>
          {nota.nota < 35 ? (
            <>
              <span style={{ color: "red", fontWeight: "bold" }}>
                {nota.nota < 10 ? <>0{nota.nota}</> : <>{nota.nota}</>}
              </span>
            </>
          ) : (
            <span style={{ color: "green", fontWeight: "bold" }}>
              {nota.nota}
            </span>
          )}
        </div>
        <br />
      </div>
    </>
  );
};

export default InfoNotaAlumnoItem;
