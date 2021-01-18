import React, { useContext } from "react";
import { Asistencia } from "./Asistencia";
import { useHistory } from "react-router-dom";
import moment from "moment";
import { GoPencil, GoX } from "react-icons/go";
import { confirmAlert } from "react-confirm-alert"; // Import
import * as asistenciaService from "./AsistenciaService";
import { UserContext } from "../Context/UserContext";

interface Props {
  asistencia: Asistencia;
  loadAsistencias?: () => void;
}

const AsistenciaItem = (props: Props) => {
  const { asistencia, loadAsistencias }: any = props;
  const history = useHistory();
  const { userData }: any = useContext(UserContext);

  const handleDelete = async (id: string) => {
    try {
      await asistenciaService.deleteAsistencia(id);
      loadAsistencias();
    } catch (e) {
      console.log(e.request.status);
    }
  };

  const modalEliminar = () => {
    confirmAlert({
      title: "Advertencia",
      message: "Esta seguro que desea eliminar?",
      buttons: [
        {
          label: "Si",
          onClick: () => asistencia._id && handleDelete(asistencia._id),
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
      <tr key={asistencia._id}>
        <td>{moment(asistencia.ingreso).utc().format("DD/MM/YYYY hh:mm")}</td>
        <td>{moment(asistencia.salida).utc().format("DD/MM/YYYY hh:mm")}</td>
        <td>{asistencia.estudiante[0].nombres}</td>
        <td>{asistencia.capitulo}</td>
        {userData.role === "Estudiante" ? (
          <></>
        ) : (
          <>
            <td>
              <GoPencil
                onClick={() => history.push(`/asistencia/${asistencia._id}`)}
                style={{
                  marginLeft: "5px",
                  cursor: "pointer",
                  fontSize: "17px",
                }}
              />
              <GoX
                onClick={modalEliminar}
                style={{
                  cursor: "pointer",
                  fontSize: "17px",
                  marginLeft: "5px",
                  color: "red",
                }}
              />
            </td>
          </>
        )}
      </tr>
    </>
  );
};
export default AsistenciaItem;
