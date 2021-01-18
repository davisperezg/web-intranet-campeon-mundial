import React, { useContext } from "react";
import moment from "moment";
import { useHistory } from "react-router-dom";
import * as documentosService from "./DocumentosService";
import { Documentos } from "./Documentos";
import { confirmAlert } from "react-confirm-alert"; // Import
import { GoPencil, GoX } from "react-icons/go";
import { UserContext } from "../Context/UserContext";
import { BiMessageDetail } from "react-icons/bi";

interface Props {
  documento: Documentos;
  id: String;
  loadDocumentos: () => void;
}

const DocumentosItem = (props: Props) => {
  const { documento, id, loadDocumentos }: any = props;
  const { userData }: any = useContext(UserContext);
  const history = useHistory();

  const handleDelete = async (id: string) => {
    try {
      await documentosService.deleteDocumentosById(id);
      loadDocumentos();
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
          onClick: () => documento._id && handleDelete(documento._id),
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
      <tr key={documento._id}>
        <td>
          {!documento.fechaEntregaBalotario ? (
            <>No registrado</>
          ) : (
            <>
              {moment(documento.fechaEntregaBalotario)
                .utc()
                .format("DD/MM/YYYY")}
            </>
          )}
        </td>
        <td>
          {!documento.fechaEntregaCertificadoMedico ? (
            <>No registrado</>
          ) : (
            <>
              {moment(documento.fechaEntregaCertificadoMedico)
                .utc()
                .format("DD/MM/YYYY")}
            </>
          )}
        </td>
        <td>
          {!documento.fechaEntregaCertificadoCofipro ? (
            <>No registrado</>
          ) : (
            <>
              {moment(documento.fechaEntregaCertificadoCofipro)
                .utc()
                .format("DD/MM/YYYY")}
            </>
          )}
        </td>
        <td>
          {!documento.fechaEntregaCarnet ? (
            <>No registrado</>
          ) : (
            <>
              {moment(documento.fechaEntregaCarnet).utc().format("DD/MM/YYYY")}
            </>
          )}
        </td>
        <td>
          {!documento.fechaEntregaGuiaManejo ? (
            <>No registrado</>
          ) : (
            <>
              {moment(documento.fechaEntregaGuiaManejo)
                .utc()
                .format("DD/MM/YYYY")}
            </>
          )}
        </td>
        <td>
          {!documento.fechaEntregaActa ? (
            <>No registrado</>
          ) : (
            <>{moment(documento.fechaEntregaActa).utc().format("DD/MM/YYYY")}</>
          )}
        </td>
        {userData.role === "Super Admin" ? (
          <>
            <td>
              {documento.observacion ? (
                <>{documento.observacion}</>
              ) : (
                <>----------</>
              )}
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
                  history.push(
                    `/alumnos/fecha/documentos/${id}/documento/${documento._id}`
                  );
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
                  history.push(
                    `/alumnos/fecha/documentos/${id}/documento/${documento._id}`
                  )
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

export default DocumentosItem;
