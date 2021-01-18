import React from "react";
import { NotasTeoricas } from "./NotasTeoricas";

interface Props {
  nota: NotasTeoricas;
}

const NotaAlumnoItem = (props: Props) => {
  const { nota } = props;
  return (
    <>
      <div key={nota._id}>
        <span>
          {nota.tipoNota} :{" "}
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
        </span>
        <br />
      </div>
    </>
  );
};

export default NotaAlumnoItem;
