import React from "react";
import { User } from "./../Users/User";

interface Props {
  profesor: User;
}

const ProfesoresSelect = (props: Props) => {
  const { profesor }: any = props;
  return (
    <>
      <option value={profesor._id}>{profesor.nombres}</option>
    </>
  );
};

export default ProfesoresSelect;
