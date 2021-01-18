import React from "react";
import { Tramites } from "./../Tramites/Tramites";

interface Props {
  tramite: Tramites;
}
const TramiteItem = (props: Props) => {
  const { tramite }: any = props;
  return (
    <>
      <option value={tramite.name}>{tramite.name}</option>
    </>
  );
};

export default TramiteItem;
