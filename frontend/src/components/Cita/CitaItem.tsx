import React from "react";
import { useHistory, useParams } from "react-router-dom";
import { Cita } from "./Cita";
import moment from "moment";
import { GrDocumentPdf } from "react-icons/gr";
import { GoPencil } from "react-icons/go";
import * as citaService from "./CitaService";
import { jsPDF } from "jspdf";
import "moment/locale/es"; // without this line it didn't work
moment.locale("es");

interface Props {
  cita: Cita;
}

const CitaItem = (props: Props) => {
  const { cita }: any = props;

  const history = useHistory();

  const generatePDF = async (id: string) => {
    const res: any = await citaService.getCitaById(id);
    //const resCitas: any = await citaService.getCitasXalumno(id);
    console.log(res.data);
    const doc = new jsPDF();
    doc.rect(7, 5, 195, 100);
    let logo =
      "data:image/png;base64,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";
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("ESCUELA DE CONDUCTORES INTEGRALES", 20, 10);
    doc.addImage(logo, "JPG", 10, 13, 100, 15);
    doc.setFont("helvetica", "bold");
    doc.text("COD: ", 10, 35);
    doc.setFont("helvetica", "normal");
    doc.text(String(res.data.estudiante.nro), 23, 35);
    doc.setFont("helvetica", "bold");
    doc.text("NOMBRES Y APELLIDOS: ", 10, 40);
    doc.setFont("helvetica", "normal");
    doc.text(String(res.data.estudiante.nombres), 65, 40);
    doc.setFont("helvetica", "bold");
    doc.text("CITA: ", 10, 45);
    doc.setFont("helvetica", "normal");
    doc.text(
      moment(String(res.data.fecha)).format("dddd, DD/MM/YYYY - hh:mm A"),
      23,
      45
    );

    doc.setFont("helvetica", "bold");
    doc.text("SECRETARIA: ", 10, 55);
    doc.setFont("helvetica", "normal");
    doc.text(String(res.data.registrador.nombres), 40, 55);

    doc.setFontSize(9);
    var nota = doc.splitTextToSize(
      "NOTA: El alumno llegará 10 minutos antes de la hora programada y deberá asistir puntualmente sin faltar. No habrá justificación por motivos de viaje, trabajo, estudio u otro compromiso, sólo habrá excepción en caso de salud previa certificación médica. El alumno perderá sus horas programadas con sus respectivos pagos. Por favor no faltar a sus practicas de manejo. Nuestro interés es que Ud. Aprenda a manejar y garantizar su brevete.",
      180
    );
    doc.text(nota, 10, 65);
    doc.line(60, 95, 95, 95);
    doc.text("Secretaria", 70, 100);
    doc.line(120, 95, 165, 95);
    doc.text("Firma del alumno", 130, 100);

    doc.save(
      "CITA_" + res.data.estudiante.nombres + "_COD_" + res.data.estudiante.nro
    );
  };
  return (
    <>
      <tr key={cita._id}>
        <td style={{ textAlign: "center" }}>{cita.estudiante.nro}</td>
        <td>{cita.estudiante.nombres}</td>
        <td>{cita.registrador.nombres}</td>
        <td>
          {moment(cita.fecha)
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
            onClick={() => cita._id && generatePDF(cita._id)}
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
