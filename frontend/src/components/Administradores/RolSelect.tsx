import React from "react";
import { Roles } from "./../Roles/Roles";

interface Props {
  roles: Roles;
}
const RolesSelect = (props: Props) => {
  const { roles }: any = props;
  return (
    <>
      <option value={roles.name}>{roles.name}</option>
    </>
  );
};

export default RolesSelect;
