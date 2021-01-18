import React, { useContext } from "react";
import { UserContext } from "../Context/UserContext";
import { Egresos } from "./Egresos";
import moment from "moment";
import { numberFormat } from "../lib/index";

interface Props {
  egreso: Egresos;
  //loadEgresos: () => void;
}

const EgresoItem = (props: Props) => {
  const { userData }: any = useContext(UserContext);
  const { egreso }: any = props;

  return (
    <>
      <tr key={egreso._id}>
        <th>{egreso.sedes.name}</th>
        <td>{String(egreso.detalle).toUpperCase()}</td>
        <td style={{ textAlign: "center" }}>{numberFormat(egreso.cantidad)}</td>
        <td style={{ textAlign: "center" }}>
          {moment(egreso.createdAt).format("DD/MM/YYYY")}
        </td>
        <td>{egreso.registrador[0].nombres}</td>
      </tr>
    </>
  );
};

export default EgresoItem;
