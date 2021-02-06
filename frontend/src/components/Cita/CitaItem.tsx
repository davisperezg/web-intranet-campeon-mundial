import React from "react";
import { useHistory, useParams } from "react-router-dom";
import { Cita } from "./Cita";
import moment from "moment";
import { GrDocumentPdf } from "react-icons/gr";
import { GoPencil } from "react-icons/go";
import { generatePDFCita } from "../lib/FichaMatriculaPDF";
import "moment/locale/es"; // without this line it didn't work
moment.locale("es");

interface Props {
  cita: Cita;
}

const CitaItem = (props: Props) => {
  const { cita }: any = props;
  const history = useHistory();

  return (
    <>
      <tr key={cita._id}>
        <td style={{ textAlign: "center" }}>{cita.estudiante.nro}</td>
        <td>{cita.estudiante.nombres}</td>
        <td>{cita.registrador.nombres}</td>
        <td>
          {moment(cita.createdAt).format("DD/MM/YYYY - hh:mm A").toUpperCase()}
        </td>
        <td>
          {moment(cita.updatedAt).format("DD/MM/YYYY - hh:mm A").toUpperCase()}
        </td>
        <td>
          {moment(cita.fecha)
            .format("dddd, DD/MM/YYYY - hh:mm A")
            .toUpperCase()}
        </td>
        <td>
          {moment(cita.fechaTermino)
            .format("dddd, DD/MM/YYYY - hh:mm A")
            .toUpperCase()}
        </td>
        <td>
          <GoPencil
            onClick={() => history.push(`/citas/registro/${cita._id}`)}
            style={{
              cursor: "pointer",
              fontSize: "17px",
              marginLeft: "5px",
            }}
          />
          <GrDocumentPdf
            onClick={() => cita._id && generatePDFCita(cita._id)}
            style={{
              cursor: "pointer",
              fontSize: "17px",
              marginLeft: "5px",
              color: "red",
            }}
          />
        </td>
      </tr>
    </>
  );
};

export default CitaItem;
