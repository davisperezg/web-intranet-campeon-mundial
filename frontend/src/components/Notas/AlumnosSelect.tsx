import React from "react";
import { Alumno } from "./../Alumnos/Alumno";

interface Props {
  alumno: Alumno;
}

const AlumnosSelect = (props: Props) => {
  const { alumno }: any = props;
  return (
    <>
      <option value={alumno._id}>
        {alumno.nombres} - {alumno.username}
      </option>
    </>
  );
};

export default AlumnosSelect;
