import React, { useContext } from "react";
import { Pagos } from "./Pagos";
import { useHistory } from "react-router-dom";
import { GoPencil, GoX } from "react-icons/go";
import moment from "moment";
import { confirmAlert } from "react-confirm-alert"; // Import
import * as pagoService from "./PagosService";
import { numberFormat } from "../lib/index";
import { UserContext } from "../Context/UserContext";
import { BiMessageDetail } from "react-icons/bi";

interface Props {
  pago: Pagos;
  id: String;
  loadPagos: () => void;
}

const PagosItem = (props: Props) => {
  const { userData }: any = useContext(UserContext);
  const { pago, id, loadPagos }: any = props;
  const history = useHistory();
  const handleDelete = async (id: string) => {
    try {
      await pagoService.deletePagosById(id);
      loadPagos();
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
          onClick: () => pago._id && handleDelete(pago._id),
        },
        {
          label: "No",
          onClick: () => {},
        },
      ],
    });
  };
  //DD/MM/YYYY hh:mm:ss
  return (
    <>
      <tr key={pago._id}>
        <th>{numberFormat(pago.cantidad)}</th>
        <td>{pago.nroRecibo}</td>
        <td>{moment(pago.createdAt).format("DD/MM/YYYY")}</td>
        <td>{pago.registrador.nombres}</td>
        {userData.role === "Super Admin" ? (
          <>
            <td>
              {pago.observacion ? <>{pago.observacion}</> : <>----------</>}
            </td>
          </>
        ) : (
          <></>
        )}
        <td>
          {userData.role === "Admin" ||
          userData.role === "Profesor" ||
          userData.role === "Estudiante" ? (
            <>
              <BiMessageDetail
                onClick={() => {
                  history.push(`/alumnos/pagos/${id}/pago/${pago._id}`);
                }}
                style={{
                  marginLeft: "5px",
                  cursor: "pointer",
                  fontSize: "17px",
                }}
              />
            </>
          ) : (
            <>
              <GoPencil
                onClick={() =>
                  history.push(`/alumnos/pagos/${id}/pago/${pago._id}`)
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
            </>
          )}
        </td>
      </tr>
    </>
  );
};

export default PagosItem;
