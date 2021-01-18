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
import { UserContext } from "../Context/UserContext";
import { GoArrowLeft } from "react-icons/go";
import { useHistory, useParams } from "react-router-dom";
import { Alumno } from "./Alumno";
import * as alumnoService from "./AlumnoService";
import * as dniService from "../Helpers/DNIService";
import { GoSync } from "react-icons/go";
import { toast } from "react-toastify";
import moment from "moment";
import { Tramites } from "./../Tramites/Tramites";
import TramiteItem from "./TramiteItem";
import { confirmAlert } from "react-confirm-alert"; // Import

type InputChange = ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;
type SelectChange = ChangeEvent<HTMLSelectElement>;

interface Params {
  id?: string;
}

const AlumnosForm = () => {
  let fecha = new Date();
  let ano = fecha.getFullYear();
  const { userData }: any = useContext(UserContext);

  const initialState = {
    nombres: "",
    username: "",
    email: "",
    dni: "",
    cellphone: "",
    startClasses: "",
    endClasses: "",
    sedes: [] || "",
    //tramites: [] || "",
    registrador: "",
  };
  const history = useHistory();

  const ref = createRef<HTMLInputElement>();

  const refPassword: any = createRef<HTMLInputElement>();

  const params = useParams<Params>();

  const [isReadonly, setIsReadonly] = useState(true);

  const [isReadonlyDNI, setIsReadonlyDNI] = useState(false);

  const [isDisabledGuardar, setDisabledGuardar] = useState(true);

  const [isDisabledButton, setDisabledButton] = useState(true);

  const [TextButton, setTextButton] = useState("Consultar");

  const [alumno, setAlumno] = useState<Alumno>(initialState);

  const [tramite, setTramite] = useState<Tramites[]>([]);

  //const [dataDNi, setDataDNI]: any = useState(initialState_user);

  const consultSeq = async () => {
    const res: any = await alumnoService.consultNroOfUsername();
    return res.data.seq;
  };

  const consultDocument = async () => {
    setIsReadonlyDNI(true);
    setIsReadonly(true);
    setDisabledButton(true);
    setTextButton("Consultando....");
    if (ref.current) {
      refPassword.current.focus();
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
        const username = async () => {
          return "E" + ano + (await consultSeq());
        }; //await username()

        //let din: number = ref.current.value;
        setAlumno({
          nombres:
            res.data.nombres +
            " " +
            res.data.apellido_paterno +
            " " +
            res.data.apellido_materno,
          username: await username(),
          email: "",
          password: "",
          dni: alumno.dni,
          cellphone: "",
          startClasses: "",
          endClasses: "",
          sedes: "",
          registrador: userData.id,
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
    setAlumno({ ...alumno, [e.target.name]: e.target.value });

  const handleSelectChange = (e: SelectChange) =>
    setAlumno({ ...alumno, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    //e.preventDefault();
    if (!params.id) {
      try {
        if (alumno.password === "") {
          return toast.error("Completar campos");
        }
        if (
          alumno.sedes === "" ||
          alumno.sedes === null ||
          alumno.sedes === undefined
        ) {
          return toast.error("Completar sede");
        }
        if (
          alumno.tramites === "" ||
          alumno.tramites === null ||
          alumno.tramites === undefined
        ) {
          return toast.error("Completar tramite");
        }
        await alumnoService.createNewAlumnos(alumno);
        await alumnoService.updateNroOfUsername();
        setAlumno(initialState);
        toast.success("Alumno añadido");
        history.push("/alumnos");
      } catch (e) {
        //console.log(e.request.response);
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
          if (JSON.parse(e.request.response).errors.dni) {
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
        await alumnoService.updateAlumnos(params.id, alumno);
        history.push("/alumnos");
      } catch (e) {
        history.push("/alumnos");
        return toast.error(JSON.parse(e.request.response).message);
      }
    }
  };

  const onKeyUpValue = (event: KeyboardEvent<HTMLInputElement>) => {
    const { value }: any = event.target;
    if (value.length === 8) {
      setDisabledButton(false);
      setTextButton("Consultar");
    } else {
      if (value.length < 8 && alumno.nombres) {
        setAlumno(initialState);
      }
      setDisabledGuardar(true);
      setDisabledButton(true);
    }
    setIsReadonly(true);
  };
  const getAlumno = async (id: string) => {
    const res: any = await alumnoService.getAlumno(id);
    //console.log(res.data);
    const {
      nombres,
      username,
      email,
      dni,
      cellphone,
      startClasses,
      endClasses,
      address,
      telephone,
    } = res.data;
    setAlumno({
      nombres,
      username,
      email,
      dni,
      cellphone,
      startClasses,
      endClasses,
      address,
      sedes: res.data.sedes[0].name,
      telephone,
      tramites: res.data.tramites[0].name,
    });
  };

  const getTramites = async () => {
    const res: any = await alumnoService.getTramites();
    setTramite(res.data);
    //console.log(res.data);
  };
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
    getTramites();
    if (params.id) getAlumno(params.id);
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
            src="https://images-campeon-mundial.s3-sa-east-1.amazonaws.com/Characters/woman-sitting-laptop.svg"
          ></img>
        </div>
        <div className="col-md-6 offset-md-4">
          <div className="card my-auto">
            <GoArrowLeft
              className="offset-md-11 offset-sm-11"
              onClick={() => {
                history.push("/alumnos");
              }}
              style={{
                cursor: "pointer",
                fontSize: "20px",
                position: "absolute",
                top: "10px",
              }}
            />
            <div className="card-body">
              <h4>EDITAR - ALUMNO {alumno.dni ? alumno.nombres : ""}</h4>
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
                      value={alumno.dni}
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
                    value={alumno.nombres}
                    readOnly={false}
                  />
                </div>
                <div className="form-row">
                  <div className="form-group col-md-6">
                    <input
                      type="text"
                      name="username"
                      placeholder="Username"
                      readOnly={true}
                      className="form-control"
                      onChange={handleInputChange}
                      value={alumno.username}
                    />
                  </div>

                  <div className="form-group col-md-6">
                    <input
                      ref={refPassword}
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
                    value={alumno.email}
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
                      value={alumno.cellphone}
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
                      value={alumno.telephone}
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
                    value={alumno.address}
                    readOnly={false}
                  />
                </div>
                <div className="form-row">
                  <div className="form-group col-md-6">
                    <label htmlFor="inputStartClasses">Inicio de clases</label>
                    <input
                      type="text"
                      name="startClasses"
                      className="form-control"
                      onChange={handleInputChange}
                      readOnly={true}
                      value={
                        alumno.startClasses
                          ? moment(alumno.startClasses)
                              .utc()
                              .format("DD/MM/YYYY")
                          : "No registrado"
                      }
                    />
                  </div>
                  <div className="form-group col-md-6">
                    <label htmlFor="inputEndClasses">Fin de clases</label>
                    <input
                      type="text"
                      name="endClasses"
                      className="form-control"
                      value={
                        alumno.endClasses
                          ? moment(alumno.endClasses).utc().format("DD/MM/YYYY")
                          : "No registrado"
                      }
                      onChange={handleInputChange}
                      readOnly={true}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="exampleSelect1">Sede</label>
                  <select
                    className="form-control"
                    id="exampleSelect1"
                    name="sedes"
                    disabled={false}
                    onChange={handleSelectChange}
                    value={String(alumno.sedes)}
                  >
                    <option value="Huacho">Huacho</option>
                    <option value="Huaral">Huaral</option>
                    <option value="Barranca">Barranca</option>
                  </select>
                </div>
                {params.id ? (
                  <>
                    {userData.role === "Super Admin" ? (
                      <>
                        <div className="form-group">
                          <label htmlFor="exampleSelect1">Tramite</label>
                          <select
                            className="form-control"
                            id="exampleSelect1"
                            name="tramites"
                            disabled={false}
                            onChange={handleSelectChange}
                            value={String(alumno.tramites)}
                          >
                            {tramite.map((tramite) => (
                              <TramiteItem
                                tramite={tramite}
                                key={tramite._id}
                              />
                            ))}
                          </select>
                        </div>
                      </>
                    ) : (
                      <></>
                    )}
                  </>
                ) : (
                  <>
                    <div className="form-group">
                      <label htmlFor="exampleSelect1">Tramite</label>
                      <select
                        className="form-control"
                        id="exampleSelect1"
                        name="tramites"
                        disabled={false}
                        onChange={handleSelectChange}
                        value={String(alumno.tramites)}
                      >
                        {tramite.map((tramite) => (
                          <TramiteItem tramite={tramite} key={tramite._id} />
                        ))}
                      </select>
                    </div>
                  </>
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
          src="https://images-campeon-mundial.s3-sa-east-1.amazonaws.com/Characters/woman-sitting-laptop.svg"
        ></img>
      </div>
      <div className="col-md-6 offset-md-4">
        <div className="card my-auto">
          <GoArrowLeft
            className="offset-md-11 offset-sm-11"
            onClick={() => {
              history.push("/alumnos");
            }}
            style={{
              cursor: "pointer",
              fontSize: "20px",
              position: "absolute",
              top: "10px",
            }}
          />
          <div className="card-body">
            <h4>ALUMNO {alumno.dni ? alumno.nombres : ""}</h4>
            <form onSubmit={modalComfirmarRegistro}>
              <div className="form-row">
                <div className="form-group col-md-8">
                  <GoSync
                    onClick={() => {
                      setIsReadonly(true);
                      setDisabledGuardar(true);
                      setAlumno(initialState);
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
                    value={alumno.dni}
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
                  className="form-control"
                  type="text"
                  name="nombres"
                  placeholder="Nombres"
                  onChange={handleInputChange}
                  value={alumno.nombres}
                  readOnly={true}
                />
              </div>
              <div className="form-row">
                <div className="form-group col-md-6">
                  <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    readOnly={true}
                    className="form-control"
                    onChange={handleInputChange}
                    value={alumno.username}
                  />
                </div>

                <div className="form-group col-md-6">
                  <input
                    ref={refPassword}
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
                  value={alumno.email}
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
                    value={alumno.cellphone}
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
                    value={alumno.telephone}
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
                  value={alumno.address}
                  readOnly={isReadonly}
                />
              </div>
              <div className="form-row">
                <div className="form-group col-md-6">
                  <label htmlFor="inputStartClasses">
                    Inicio de clases (opcional)
                  </label>
                  <input
                    type="date"
                    name="startClasses"
                    className="form-control"
                    onChange={handleInputChange}
                    readOnly={isReadonly}
                    value={alumno.startClasses}
                  />
                </div>
                <div className="form-group col-md-6">
                  <label htmlFor="inputEndClasses">
                    Fin de clases (opcional)
                  </label>
                  <input
                    type="date"
                    name="endClasses"
                    className="form-control"
                    value={alumno.endClasses}
                    onChange={handleInputChange}
                    readOnly={isReadonly}
                  />
                </div>
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
                <label htmlFor="exampleSelect1">Tramite</label>
                <select
                  className="form-control"
                  id="exampleSelect1"
                  name="tramites"
                  disabled={isReadonly}
                  onChange={handleSelectChange}
                  defaultValue={"NOSELECT"}
                >
                  <option value="NOSELECT" disabled>
                    Seleccione un tramite
                  </option>
                  {tramite.map((tramite) => (
                    <TramiteItem tramite={tramite} key={tramite._id} />
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

export default AlumnosForm;
