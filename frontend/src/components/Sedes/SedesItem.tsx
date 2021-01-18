import React from "react";
import { GoPencil } from "react-icons/go";
import { Sedes } from "./Sedes";
import { useHistory } from "react-router-dom";
import moment from "moment";

interface Props {
  sede: Sedes;
}

const SedesItem = (props: Props) => {
  const { sede } = props;
  const history = useHistory();

  return (
    <>
      <tr key={sede._id}>
        <th>{sede.name}</th>
        <td style={{ textAlign: "center" }}>{sede.seq}</td>
        <td style={{ textAlign: "center" }}>
          {moment(sede.createdAt).utc().format("DD/MM/YYYY")}
        </td>
        <td style={{ textAlign: "center" }}>
          {moment(sede.updatedAt).utc().format("DD/MM/YYYY")}
        </td>
        <td style={{ textAlign: "center" }}>
          <GoPencil
            onClick={() => history.push(`/sedes/${sede._id}`)}
            style={{ marginLeft: "5px", cursor: "pointer", fontSize: "17px" }}
          />
        </td>
      </tr>
    </>
  );
};

export default SedesItem;
