/* eslint-disable jsx-a11y/alt-text */
import React, {
  createRef,
  ChangeEvent,
  useState,
  FormEvent,
  KeyboardEvent,
  useEffect,
  useContext,
} from "react";
import { GoArrowLeft } from "react-icons/go";
import { useHistory, useParams } from "react-router-dom";
import { Alumno } from "../Alumnos/Alumno";
import * as adminService from "./UsuariosService";
import * as dniService from "../Helpers/DNIService";
import * as rolesService from "../Roles/RolesService";
import RolSelect from "./RolSelect";
import { GoSync } from "react-icons/go";
import { toast } from "react-toastify";
import { Roles } from "./../Roles/Roles";
import { confirmAlert } from "react-confirm-alert"; // Import
import moment from "moment";
import { UserContext } from "../Context/UserContext";

type InputChange = ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;
type SelectChange = ChangeEvent<HTMLSelectElement>;

interface Params {
  id?: string;
}

const AdministradoresForm = () => {
  const initialState = {
    nombres: "",
    username: "",
    email: "",
    dni: "",
    cellphone: "",
    sedes: [] || "",
  };
  const { userData }: any = useContext(UserContext);

  const history = useHistory();

  const ref = createRef<HTMLInputElement>();

  const refUsername: any = createRef<HTMLInputElement>();

  const params = useParams<Params>();

  const [isReadonly, setIsReadonly] = useState(true);

  const [isReadonlyDNI, setIsReadonlyDNI] = useState(false);

  const [isDisabledGuardar, setDisabledGuardar] = useState(true);

  const [isDisabledButton, setDisabledButton] = useState(true);

  const [TextButton, setTextButton] = useState("Consultar");

  const [admin, setAdmin] = useState<Alumno>(initialState);

  const [roles, setRoles] = useState<Roles[]>([]);

  const consultDocument = async () => {
    setIsReadonlyDNI(true);
    setIsReadonly(true);
    setDisabledButton(true);
    setTextButton("Consultando....");
    if (ref.current) {
      refUsername.current.focus();
      try {
        const res = await dniService.consultDNI(ref.current.value);
        if (
          res === null ||
          res === undefined ||
          res.data === null ||
          res.data === undefined
        ) {
          setIsReadonlyDNI(false);
          setTextButton("Consulte otro D.N.I");
          return toast.error("No se encontró D.N.I");
        }

        //let din: number = ref.current.value;
        setAdmin({
          nombres:
            res.data.nombres +
            " " +
            res.data.apellido_paterno +
            " " +
            res.data.apellido_materno,
          username: "",
          email: "",
          dni: admin.dni,
          cellphone: "",
          sedes: "",
        });
        setIsReadonlyDNI(false);
        setIsReadonly(false);
        setDisabledButton(true);
        setDisabledGuardar(false);
        setTextButton("Consultado");
      } catch (e) {
        if (e.request) {
          toast.error(
            "Verificar el campo. No se permite letras. No se permite espacios. Si el error persiste comunicarse con el administrador."
          );
          setIsReadonlyDNI(false);
          setIsReadonly(true);
          setTextButton("Consultar");
        }
      }
    }
  };

  const handleInputChange = (e: InputChange) =>
    setAdmin({ ...admin, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    //e.preventDefault();
    if (!params.id) {
      try {
        if (admin.password === "" || admin.password === undefined) {
          return toast.error("Completar campos");
        }
        if (
          admin.sedes === "" ||
          admin.sedes === null ||
          admin.sedes === undefined
        ) {
          return toast.error("Completar sede");
        }
        if (
          admin.roles === "" ||
          admin.roles === null ||
          admin.roles === undefined
        ) {
          return toast.error("Completar rol");
        }
        await adminService.createNewAdmin(admin);
        setAdmin(initialState);
        toast.success("Usuario añadido");
        history.push("/usuarios");
      } catch (e) {
        //console.log(e);
        //console.log(JSON.parse(e.request.response).password);
        if (JSON.parse(e.request.response).keyValue) {
          if (JSON.parse(e.request.response).keyValue.username) {
            return toast.error("El username ya existe");
          } else if (JSON.parse(e.request.response).keyValue.dni) {
            return toast.error("El D.N.I ya pertenece a un usuario");
          } else if (JSON.parse(e.request.response).keyValue.email) {
            return toast.error("El email ya pertenece a un usuario");
          } else if (JSON.parse(e.request.response).keyValue.cellphone) {
            return toast.error("El celular ya pertenece a un usuario");
          }
        } else {
          if (JSON.parse(e.request.response).password) {
            console.log("wha");
            return toast.error(JSON.parse(e.request.response).password.message);
          }
          if (JSON.parse(e.request.response).errors.dni) {
            console.log("wha");
            return toast.error(
              JSON.parse(e.request.response).errors.dni.message
            );
          } else if (JSON.parse(e.request.response).errors.nombres) {
            return toast.error(
              JSON.parse(e.request.response).errors.nombres.message
            );
          } else if (JSON.parse(e.request.response).errors.username) {
            return toast.error(
              JSON.parse(e.request.response).errors.username.message
            );
          } else if (JSON.parse(e.request.response).errors.email) {
            return toast.error(
              JSON.parse(e.request.response).errors.email.message
            );
          } else if (JSON.parse(e.request.response).errors.cellphone) {
            return toast.error(
              JSON.parse(e.request.response).errors.cellphone.message
            );
          }
        }
      }
    } else {
      try {
        await adminService.updateAdmin(params.id, admin);
        history.push("/usuarios");
      } catch (e) {
        console.log(e);
      }
    }
  };

  const onKeyUpValue = (event: KeyboardEvent<HTMLInputElement>) => {
    const { value }: any = event.target;
    if (value.length === 8) {
      setDisabledButton(false);
      setTextButton("Consultar");
    } else {
      if (value.length < 8 && admin.nombres) {
        setAdmin(initialState);
      }
      setDisabledGuardar(true);
      setDisabledButton(true);
    }
    setIsReadonly(true);
  };
  const getAdmi = async (id: string) => {
    const res: any = await adminService.getAdministrador(id);
    const {
      nombres,
      username,
      email,
      dni,
      cellphone,
      address,
      nivel,
    } = res.data;
    console.log(res.data);
    setAdmin({
      nombres,
      username,
      email,
      dni,
      cellphone,
      address,
      sedes: res.data.sedes[0].name,
      roles: res.data.roles[0].name,
      nivel,
    });
  };

  const getRoles = async () => {
    const res: any = await rolesService.getRoles();
    setRoles(res.data);
    console.log(res.data);
  };

  const handleSelectChange = (e: SelectChange) =>
    setAdmin({ ...admin, [e.target.name]: e.target.value });

  const modalComfirmarUpdate = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    confirmAlert({
      title: "Mensaje",
      message: "Esta seguro que desea actualizar ?",
      buttons: [
        {
          label: "Si",
          onClick: () => {
            handleSubmit();
          },
        },
        {
          label: "No",
          onClick: () => {},
        },
      ],
    });
  };

  const modalComfirmarRegistro = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    confirmAlert({
      title: "Mensaje",
      message: "Esta seguro que desea registrar ?",
      buttons: [
        {
          label: "Si",
          onClick: () => {
            handleSubmit();
          },
        },
        {
          label: "No",
          onClick: () => {},
        },
      ],
    });
  };

  useEffect(() => {
    getRoles();
    if (params.id) getAdmi(params.id);
  }, [params.id]);
  //offset-md-8
  if (params.id) {
    return (
      <div className="row">
        <div className="offset-md-2">
          <img
            style={{
              position: "absolute",
              width: "30%",
              height: "97%",
              top: "20px",
              left: "125px",
            }}
            width="20"
            height="200"
            src="https://images-campeon-mundial.s3-sa-east-1.amazonaws.com/Characters/graph-man.svg"
          ></img>
        </div>
        <div className="col-md-6 offset-md-4">
          <div className="card my-auto">
            <GoArrowLeft
              className="offset-md-11 offset-sm-11"
              onClick={() => {
                history.push("/usuarios");
              }}
              style={{
                cursor: "pointer",
                fontSize: "20px",
                position: "absolute",
                top: "10px",
              }}
            />
            <div className="card-body">
              <h4>EDITAR - USUARIO {admin.dni ? admin.nombres : ""}</h4>
              <form onSubmit={modalComfirmarUpdate}>
                <div className="form-row">
                  <div className="form-group col-md-12">
                    <input
                      readOnly={true}
                      ref={ref}
                      type="text"
                      name="dni"
                      placeholder="D.N.I"
                      className="form-control"
                      value={admin.dni}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    name="nombres"
                    placeholder="Nombres"
                    className="form-control"
                    onChange={handleInputChange}
                    value={admin.nombres}
                    readOnly={false}
                  />
                </div>
                <div className="form-row">
                  <div className="form-group col-md-6">
                    <input
                      type="text"
                      ref={refUsername}
                      name="username"
                      placeholder="Username"
                      readOnly={true}
                      className="form-control"
                      onChange={handleInputChange}
                      value={admin.username}
                    />
                  </div>

                  <div className="form-group col-md-6">
                    <input
                      type="text"
                      name="password"
                      className="form-control"
                      onChange={handleInputChange}
                      placeholder="Password (opcional)"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <input
                    type="email"
                    name="email"
                    placeholder="Correo electronico"
                    className="form-control"
                    onChange={handleInputChange}
                    value={admin.email}
                    readOnly={false}
                  />
                </div>
                <div className="form-row">
                  <div className="form-group col-md-6">
                    <input
                      type="text"
                      name="cellphone"
                      placeholder="Celular"
                      className="form-control"
                      onChange={handleInputChange}
                      value={admin.cellphone}
                      readOnly={false}
                    />
                  </div>
                  <div className="form-group col-md-6">
                    <input
                      type="text"
                      name="telephone"
                      placeholder="Telefono (opcional)"
                      className="form-control"
                      onChange={handleInputChange}
                      value={admin.telephone}
                      readOnly={false}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    name="address"
                    placeholder="Dirección (opcional)"
                    className="form-control"
                    onChange={handleInputChange}
                    value={admin.address}
                    readOnly={false}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="exampleSelect1">Sede</label>
                  <select
                    className="form-control"
                    id="exampleSelect1"
                    name="sedes"
                    disabled={false}
                    onChange={handleSelectChange}
                    value={String(admin.sedes)}
                  >
                    <option value="Huacho">Huacho</option>
                    <option value="Huaral">Huaral</option>
                    <option value="Barranca">Barranca</option>
                  </select>
                </div>
                {Number(admin.nivel) === 2 ? (
                  <>
                    <div className="form-group">
                      <label htmlFor="exampleSelect1">Rol</label>
                      <select
                        className="form-control"
                        id="exampleSelect1"
                        name="roles"
                        disabled={false}
                        onChange={handleSelectChange}
                        value={String(admin.roles)}
                      >
                        {roles.map((roles) => (
                          <RolSelect roles={roles} key={roles._id} />
                        ))}
                      </select>
                    </div>
                  </>
                ) : (
                  <></>
                )}
                <button className="btn btn-warning" style={{ width: "100%" }}>
                  Actualizar
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // REGISTRO ALUMNO

  return (
    <div className="row">
      <div className="offset-md-2">
        <img
          style={{
            position: "absolute",
            width: "30%",
            height: "97%",
            top: "20px",
            left: "125px",
          }}
          width="20"
          height="200"
          src="https://images-campeon-mundial.s3-sa-east-1.amazonaws.com/Characters/graph-man.svg"
        ></img>
      </div>
      <div className="col-md-6 offset-md-4">
        <div className="card my-auto">
          <GoArrowLeft
            className="offset-md-11 offset-sm-11"
            onClick={() => {
              history.push("/usuarios");
            }}
            style={{
              cursor: "pointer",
              fontSize: "20px",
              position: "absolute",
              top: "10px",
            }}
          />
          <div className="card-body">
            <h4>USUARIO {admin.dni ? admin.nombres : ""}</h4>
            <form onSubmit={modalComfirmarRegistro}>
              <div className="form-row">
                <div className="form-group col-md-8">
                  <GoSync
                    onClick={() => {
                      setIsReadonly(true);
                      setDisabledGuardar(true);
                      setAdmin(initialState);
                    }}
                    className="offset-md-11 offset-sm-11"
                    style={{
                      cursor: "pointer",
                      position: "absolute",
                      top: "10px",
                    }}
                  />
                  <input
                    readOnly={isReadonlyDNI}
                    ref={ref}
                    type="text"
                    name="dni"
                    placeholder="D.N.I"
                    className="form-control"
                    autoFocus
                    value={admin.dni}
                    onKeyUp={onKeyUpValue}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group col-md-4">
                  <button
                    disabled={isDisabledButton}
                    onClick={consultDocument}
                    type="button"
                    className="btn btn-info  btn-block"
                  >
                    {TextButton}
                  </button>
                </div>
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="nombres"
                  placeholder="Nombres"
                  className="form-control"
                  onChange={handleInputChange}
                  value={admin.nombres}
                  readOnly={true}
                />
              </div>
              <div className="form-row">
                <div className="form-group col-md-6">
                  <input
                    ref={refUsername}
                    type="text"
                    name="username"
                    placeholder="Username"
                    readOnly={isReadonly}
                    className="form-control"
                    onChange={handleInputChange}
                    value={admin.username}
                  />
                </div>

                <div className="form-group col-md-6">
                  <input
                    type="text"
                    name="password"
                    placeholder="Paswword"
                    className="form-control"
                    onChange={handleInputChange}
                    //value={alumno.password}
                    readOnly={isReadonly}
                  />
                </div>
              </div>
              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  placeholder="Correo electronico"
                  className="form-control"
                  onChange={handleInputChange}
                  value={admin.email}
                  readOnly={isReadonly}
                />
              </div>
              <div className="form-row">
                <div className="form-group col-md-6">
                  <input
                    type="text"
                    name="cellphone"
                    placeholder="Celular"
                    className="form-control"
                    onChange={handleInputChange}
                    value={admin.cellphone}
                    readOnly={isReadonly}
                  />
                </div>
                <div className="form-group col-md-6">
                  <input
                    type="text"
                    name="telephone"
                    placeholder="Telefono (opcional)"
                    className="form-control"
                    onChange={handleInputChange}
                    value={admin.telephone}
                    readOnly={isReadonly}
                  />
                </div>
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="address"
                  placeholder="Dirección (opcional)"
                  className="form-control"
                  onChange={handleInputChange}
                  value={admin.address}
                  readOnly={isReadonly}
                />
              </div>
              <div className="form-group">
                <label htmlFor="exampleSelect1">Sede</label>
                <select
                  className="form-control"
                  id="exampleSelect1"
                  name="sedes"
                  disabled={isReadonly}
                  onChange={handleSelectChange}
                  defaultValue={"NOSELECT"}
                >
                  <option value="NOSELECT" disabled>
                    Seleccione una sede
                  </option>
                  <option value="Huacho">Huacho</option>
                  <option value="Huaral">Huaral</option>
                  <option value="Barranca">Barranca</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="exampleSelect1">Rol</label>
                <select
                  className="form-control"
                  id="exampleSelect1"
                  name="roles"
                  disabled={isReadonly}
                  onChange={handleSelectChange}
                  defaultValue={"NOSELECT"}
                >
                  <option value="NOSELECT" disabled>
                    Seleccione un rol
                  </option>
                  {roles.map((roles) => (
                    <RolSelect roles={roles} key={roles._id} />
                  ))}
                </select>
              </div>
              <button
                className="btn btn-primary"
                style={{ width: "100%" }}
                disabled={isDisabledGuardar}
              >
                Guardar
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdministradoresForm;
