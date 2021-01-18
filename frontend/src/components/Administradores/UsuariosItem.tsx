import React, { useContext } from "react";
import { GoPencil, GoX, GoClippy } from "react-icons/go";
import { Alumno } from "../Alumnos/Alumno";
import { useHistory } from "react-router-dom";
import * as adminService from "./UsuariosService";
import moment from "moment";
import { confirmAlert } from "react-confirm-alert"; // Import
import { UserContext } from "../Context/UserContext";
import { GoCheck, GoDash } from "react-icons/go";

interface Props {
  admin: Alumno;
  loadAdmin: () => void;
}
const AdminItem = (props: Props) => {
  const { userData }: any = useContext(UserContext);

  const { admin, loadAdmin }: any = props;
  const history = useHistory();

  const desUser = async (id: string) => {
    try {
      await adminService.desUser(id);
      loadAdmin();
    } catch (e) {
      console.log(e.request.status);
    }
  };

  const habUser = async (id: string) => {
    try {
      await adminService.habUser(id);
      loadAdmin();
    } catch (e) {
      console.log(e.request.status);
    }
  };

  const modalDes = () => {
    confirmAlert({
      title: "Advertencia",
      message: "Esta seguro que desea deshabilitar al usuario?",
      buttons: [
        {
          label: "Si",
          onClick: () => admin._id && desUser(admin._id),
        },
        {
          label: "No",
          onClick: () => {},
        },
      ],
    });
  };

  const modalHab = () => {
    confirmAlert({
      title: "Advertencia",
      message: "Esta seguro que desea habilitar al usuario?",
      buttons: [
        {
          label: "Si",
          onClick: () => admin._id && habUser(admin._id),
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
      {admin.roles[0].name === "Super Admin" ||
      admin.roles[0].name === "Admin" ||
      admin.roles[0].name === "Profesor" ? (
        <>
          <tr key={admin._id}>
            <th>{admin.username}</th>
            <th>{admin.roles[0].name}</th>
            <td>{admin.nombres}</td>
            <td>{admin.sedes[0].name}</td>
            <td>{admin.dni}</td>
            <td>{moment(admin.createdAt).format("DD/MM/YYYY")}</td>
            <td>{moment(admin.updatedAt).format("DD/MM/YYYY")}</td>
            <td>
              {userData.nivel === 1 ? (
                <>
                  <GoPencil
                    onClick={() =>
                      history.push(`/usuarios/registro/${admin._id}`)
                    }
                    style={{
                      cursor: "pointer",
                      fontSize: "17px",
                      marginLeft: "5px",
                    }}
                  />
                  {admin.username === "SA" ? (
                    <></>
                  ) : (
                    <>
                      {admin.estado === 1 ? (
                        <>
                          <GoCheck
                            onClick={modalDes}
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
                            onClick={modalHab}
                            style={{
                              cursor: "pointer",
                              fontSize: "17px",
                              marginLeft: "5px",
                              color: "red",
                            }}
                          />
                        </>
                      )}
                    </>
                  )}
                  <GoClippy
                    onClick={() => history.push(`/usuarios/info/${admin._id}`)}
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
                  {userData.nivel === 2 && admin.username === "SA" ? (
                    <></>
                  ) : (
                    <>
                      {admin.roles[0].name === userData.role ? (
                        <>
                          <GoPencil
                            onClick={() =>
                              history.push(`/usuarios/registro/${admin._id}`)
                            }
                            style={{
                              cursor: "pointer",
                              fontSize: "17px",
                              marginLeft: "5px",
                            }}
                          />
                          <GoClippy
                            onClick={() =>
                              history.push(`/usuarios/info/${admin._id}`)
                            }
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
                            onClick={() =>
                              history.push(`/usuarios/registro/${admin._id}`)
                            }
                            style={{
                              cursor: "pointer",
                              fontSize: "17px",
                              marginLeft: "5px",
                            }}
                          />
                          {admin.estado === 1 ? (
                            <>
                              <GoCheck
                                onClick={modalDes}
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
                                onClick={modalHab}
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
                            onClick={() =>
                              history.push(`/usuarios/info/${admin._id}`)
                            }
                            style={{
                              cursor: "pointer",
                              fontSize: "17px",
                              marginLeft: "5px",
                              color: "green",
                            }}
                          />
                        </>
                      )}
                    </>
                  )}
                </>
              )}
            </td>
          </tr>
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default AdminItem;
