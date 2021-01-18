import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import moment from "moment";
import { Practicas } from "./Practicas";
import { GoPencil, GoX } from "react-icons/go";
import { confirmAlert } from "react-confirm-alert"; // Import
import * as practicaService from "./PracticasService";
import { UserContext } from "../Context/UserContext";

interface Props {
  practica: Practicas;
  loadPracticas?: () => void;
}

const PracticasItem = (props: Props) => {
  const { practica, loadPracticas }: any = props;
  const history = useHistory();
  const { userData }: any = useContext(UserContext);

  const handleDelete = async (id: string) => {
    try {
      await practicaService.deletePracticaById(id);
      loadPracticas();
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
          onClick: () => practica._id && handleDelete(practica._id),
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
      <tr key={practica._id}>
        <th className="table-dark">{practica.nro}</th>
        <td>{practica.profesor[0].nombres}</td>
        <td>{moment(practica.fecha).utc().format("DD/MM/YYYY")}</td>
        <td>{practica.horaInicio}</td>
        <td>{practica.horaSalida}</td>
        <td>{practica.estudiante[0].nombres}</td>
        {userData.role === "Estudiante" ? (
          <></>
        ) : (
          <>
            <td>
              <GoPencil
                onClick={() =>
                  history.push(`/horariopracticas/${practica._id}`)
                }
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

export default PracticasItem;
