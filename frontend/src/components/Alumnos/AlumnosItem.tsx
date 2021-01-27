import React, { useState, useContext } from "react";
import { GoPencil, GoX, GoClippy } from "react-icons/go";
import { Alumno } from "./Alumno";
import { useHistory } from "react-router-dom";
import * as alumnoService from "./AlumnoService";
import { confirmAlert } from "react-confirm-alert"; // Import
import { GiCardPlay, GiCalendar } from "react-icons/gi";
import { GoCheck, GoDash } from "react-icons/go";
import { UserContext } from "../Context/UserContext";
import { GrDocumentPdf } from "react-icons/gr";
import { GrNotes } from "react-icons/gr";
import { generatePDF } from "../lib/FichaMatriculaPDF";
import moment from "moment";
import "moment/locale/es"; // without this line it didn't work

moment.locale("es");

interface Props {
  alumno: Alumno;
  loadAlumnos: () => void;
}
const SedesItem = (props: Props) => {
  const { userData }: any = useContext(UserContext);
  const { alumno, loadAlumnos }: any = props;
  const history = useHistory();
  const handleDes = async (id: string) => {
    try {
      await alumnoService.deleteAlumnosById(id);
      loadAlumnos();
    } catch (e) {
      console.log(e.request.status);
    }
  };

  const handleHab = async (id: string) => {
    try {
      await alumnoService.habAlumnosById(id);
      loadAlumnos();
    } catch (e) {
      console.log(e.request.status);
    }
  };

  const modalDeshabilitar = () => {
    confirmAlert({
      title: "Advertencia",
      message: "Esta seguro que desea deshabilitar al estudiante?",
      buttons: [
        {
          label: "Si",
          onClick: () => alumno._id && handleDes(alumno._id),
        },
        {
          label: "No",
          onClick: () => {},
        },
      ],
    });
  };

  const modalHabilitar = () => {
    confirmAlert({
      title: "Mensaje",
      message: "Esta seguro que desea habilitar al estudiante?",
      buttons: [
        {
          label: "Si",
          onClick: () => alumno._id && handleHab(alumno._id),
        },
        {
          label: "No",
          onClick: () => {},
        },
      ],
    });
  };

  return (
    <>
      <tr key={alumno._id}>
        <th>{alumno.username}</th>
        <td style={{ textAlign: "center" }}>{alumno.nro}</td>
        <td>{alumno.nombres}</td>
        <td>{alumno.sedes[0].name}</td>
        {/**<td>{alumno.tramites[0].name}</td> */}
        <td>{alumno.dni}</td>

        <td style={{ textAlign: "center" }}>
          {moment(alumno.createdAt).format("DD/MM/YYYY")}
        </td>
        <td style={{ textAlign: "center" }}>
          {moment(alumno.updatedAt).format("DD/MM/YYYY")}
        </td>
        <td>
          {userData.role === "Profesor" ? (
            <>
              <GoClippy
                onClick={() => history.push(`/alumnos/info/${alumno._id}`)}
                style={{
                  cursor: "pointer",
                  fontSize: "17px",
                  marginLeft: "5px",
                  color: "green",
                }}
              />
              <GrNotes
                onClick={() => history.push(`/notasmanejo/${alumno._id}`)}
                style={{
                  cursor: "pointer",
                  fontSize: "17px",
                  marginLeft: "5px",
                  color: "green",
                }}
              />
            </>
          ) : (
            <>
              <GoPencil
                onClick={() => history.push(`/alumnos/registro/${alumno._id}`)}
                style={{
                  cursor: "pointer",
                  fontSize: "17px",
                  marginLeft: "5px",
                }}
              />
              {alumno.estado === 1 ? (
                <>
                  <GoCheck
                    onClick={modalDeshabilitar}
                    style={{
                      cursor: "pointer",
                      fontSize: "17px",
                      marginLeft: "5px",
                      color: "green",
                    }}
                  />
                </>
              ) : (
                <>
                  <GoDash
                    onClick={modalHabilitar}
                    style={{
                      cursor: "pointer",
                      fontSize: "17px",
                      marginLeft: "5px",
                      color: "red",
                    }}
                  />
                </>
              )}

              <GoClippy
                onClick={() => history.push(`/alumnos/info/${alumno._id}`)}
                style={{
                  cursor: "pointer",
                  fontSize: "17px",
                  marginLeft: "5px",
                  color: "green",
                }}
              />

              <GiCardPlay
                onClick={() => history.push(`/alumnos/pagos/${alumno._id}`)}
                style={{
                  cursor: "pointer",
                  fontSize: "17px",
                  marginLeft: "5px",
                  color: "#FFC300",
                }}
              />

              <GiCalendar
                onClick={() =>
                  history.push(`/alumnos/fecha/documentos/${alumno._id}`)
                }
                style={{
                  cursor: "pointer",
                  fontSize: "17px",
                  marginLeft: "5px",
                  color: "blue",
                }}
              />

              <GrDocumentPdf
                onClick={() => alumno._id && generatePDF(alumno._id)}
                style={{
                  cursor: "pointer",
                  fontSize: "17px",
                  marginLeft: "5px",
                  color: "red",
                }}
              />
              <GrNotes
                onClick={() => history.push(`/notasmanejo/${alumno._id}`)}
                style={{
                  cursor: "pointer",
                  fontSize: "17px",
                  marginLeft: "5px",
                  color: "green",
                }}
              />
            </>
          )}
        </td>
      </tr>
    </>
  );
};

export default SedesItem;
