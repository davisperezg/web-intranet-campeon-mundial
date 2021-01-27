import React from "react";
import { Tramites } from "./../Tramites/Tramites";
import { numberFormat } from "../lib/index";

interface Props {
  tramite: Tramites;
}
const TramiteItem = (props: Props) => {
  const { tramite }: any = props;
  return (
    <>
      <option value={tramite.name}>
        {tramite.name} - {numberFormat(tramite.costo)}{" "}
      </option>
    </>
  );
};

export default TramiteItem;
