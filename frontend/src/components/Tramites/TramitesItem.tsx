import React from "react";
import { GoPencil } from "react-icons/go";
import { Tramites } from "./Tramites";
import { useHistory } from "react-router-dom";
import moment from "moment";
import { numberFormat } from "../lib/index";

interface Props {
  sede: Tramites;
}

const TramitesItem = (props: Props) => {
  const { sede } = props;
  const history = useHistory();

  return (
    <>
      <tr key={sede._id}>
        <td>{sede.name}</td>
        <td style={{ textAlign: "center" }}>{numberFormat(sede.costo)}</td>
        <td style={{ textAlign: "center" }}>
          {moment(sede.createdAt).format("DD/MM/YYYY")}
        </td>
        <td style={{ textAlign: "center" }}>
          {moment(sede.updatedAt).format("DD/MM/YYYY")}
        </td>
        <td style={{ textAlign: "center" }}>
          <GoPencil
            onClick={() => history.push(`/tramites/registro/${sede._id}`)}
            style={{ marginLeft: "5px", cursor: "pointer", fontSize: "17px" }}
          />
        </td>
      </tr>
    </>
  );
};

export default TramitesItem;
