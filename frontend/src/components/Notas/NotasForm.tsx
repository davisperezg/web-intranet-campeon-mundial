import React, {
  useEffect,
  useState,
  FormEvent,
  ChangeEvent,
  useContext,
  useCallback,
} from "react";
import * as notasService from "../Notas/NotasService";
import { Alumno } from "./../Alumnos/Alumno";
import AlumnosSelect from "./AlumnosSelect";
import { toast } from "react-toastify";
import { NotasTeoricas } from "./NotasTeoricas";
import { confirmAlert } from "react-confirm-alert"; // Import
import NotaAlumnoItem from "./NotaAlumnoItem";
import NotaAlumnoItemS from "./NotaAlumnoItemS";
import MostarSesionTerminada from "./../lib/SesionTerminada";
import { UserContext } from "../Context/UserContext";

type InputChange = ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;
type SelectChange = ChangeEvent<HTMLSelectElement>;

const NotasForm = () => {
  const initialState = {
    tipoNota: "PSICOSOMATICO",
    nota: 35,
    estudiante: "NOSELECT",
  };
  const { userData, setUserData }: any = useContext(UserContext);

  const [alumnos, setAlumnos] = useState<Alumno[]>([]);
  const [notas, setNotas] = useState<NotasTeoricas[]>([]);
  const [notass, setNotass] = useState<NotasTeoricas[]>([]);
  const [alumno, setAlumno] = useState<any>({});
  const [nota, setNota] = useState<NotasTeoricas>(initialState);
  const [isDisabledButton, setDisabledButton] = useState<boolean>(true);
  const [isDisabledSelect, setDisabledSelect] = useState<boolean>(true);
  const [isDisabledInput, setDisabledInput] = useState<boolean>(true);
  const [isStatusAlumno, setStatusAlumno] = useState<any>({});

  //const loadPromedio = useCallback(async () => {
  //const res1ero = await notasService.getNotasXAlumnos(nota.estudiante);
  //const res2do = await notasService.getNotasXAlumnosS(nota.estudiante);
  //const recorre1ero = res1ero.data.map((notas: any) => notas.nota);
  //const recorre2do = res2do.data.map((notas: any) => notas.nota);
  //const suma1ero = recorre1ero.reduce((a, b) => a + b, 0);
  //const suma2do = recorre2do.reduce((a, b) => a + b, 0);

  //}, [nota.estudiante]);

  const loadAlumnos = async () => {
    try {
      const res = await notasService.getAlumnos();
      setAlumnos(res.data);
    } catch (e) {
      console.log(e);
    }
  };

  const loadAlumno = useCallback(async () => {
    const res = await notasService.getAlumno(nota.estudiante);
    setAlumno(res.data);
  }, [nota.estudiante]);

  const handleInputChange = (e: InputChange) =>
    setNota({ ...nota, [e.target.name]: e.target.value });

  const handleSelectChange = async (e: SelectChange) => {
    setNota({ ...nota, [e.target.name]: e.target.value });
    setDisabledButton(false);
    setDisabledSelect(false);
    setDisabledInput(false);
  };
  const loadDataAlumno = useCallback(async () => {
    const res = await notasService.getNotasXAlumnos(nota.estudiante);
    setNotas(res.data);
  }, [nota.estudiante]);

  const loadDataAlumnoS = useCallback(async () => {
    const res = await notasService.getNotasXAlumnosS(nota.estudiante);
    setNotass(res.data);
  }, [nota.estudiante]);

  const consultAndValida = useCallback(async () => {
    const res: any = await notasService.getConsultAndValidate(
      nota.tipoNota,
      nota.estudiante
    );
    setStatusAlumno(res.data);
  }, [nota.tipoNota, nota.estudiante]);

  const handleSubmit = async () => {
    try {
      await notasService.createNewNota(nota);
      setNota(initialState);
      toast.success("Nota añadido");
      setDisabledButton(true);
      setDisabledSelect(true);
      setDisabledInput(true);
      loadDataAlumno();
      //loadPromedio();
    } catch (e) {
      toast.error(JSON.parse(e.request.response).message);
    }
  };

  const handleSubmitS = async () => {
    try {
      await notasService.createNewNotaS(nota);
      setNota(initialState);
      toast.success("Nota añadido");
      setDisabledButton(true);
      setDisabledSelect(true);
      setDisabledInput(true);
      loadDataAlumnoS();
      loadDataAlumno();
      //loadPromedio();
    } catch (e) {
      toast.error(JSON.parse(e.request.response).message);
    }
  };

  const modalComfirmar = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isStatusAlumno.message === "1") {
      confirmAlert({
        title: "Mensaje",
        message: "Esta seguro que desea registrar la nota ?",
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
    } else if (isStatusAlumno.message === "2") {
      confirmAlert({
        title: "Advertencia",
        message:
          "Se ha encontrado una nota ya registrada. Esta será su segunda oportunidad ?. No habrá vuelta atras.",
        buttons: [
          {
            label: "Aceptar",
            onClick: () => {
              handleSubmitS();
            },
          },
          {
            label: "Cancelar",
            onClick: () => {},
          },
        ],
      });
    } else {
      confirmAlert({
        title: "100%",
        message:
          "El alumno ya completo sus notas con un 1er y 2do intento del tipo " +
          nota.tipoNota,
        buttons: [
          {
            label: "Ok",
            onClick: () => {},
          },
        ],
      });
    }
  };

  useEffect(() => {
    loadAlumnos();

    if (nota.estudiante !== "NOSELECT") {
      loadAlumno();
      loadDataAlumno();
      consultAndValida();
      loadDataAlumnoS();
      //loadPromedio();
    }
  }, [
    nota.estudiante,
    nota.tipoNota,
    loadDataAlumnoS,
    loadDataAlumno,
    consultAndValida,
    //loadPromedio,
    loadAlumno,
  ]);

  return (
    <>
      <div className="card">
        <div className="card-header">Notas teoricas</div>

        <div className="card-body">
          <form onSubmit={modalComfirmar}>
            <div className="form-group row">
              <label
                htmlFor="inputPassword"
                className="col-sm-2 col-form-label"
              >
                Alumno
              </label>
              <div className="col-sm-10">
                <div className="form-group">
                  <select
                    autoFocus={true}
                    name="estudiante"
                    onChange={handleSelectChange}
                    className="custom-select"
                    value={nota.estudiante}
                    //defaultValue={"NOSELECT"}
                  >
                    <option value="NOSELECT" disabled>
                      Seleccione al alumno
                    </option>
                    {alumnos.map((alumno) => (
                      <AlumnosSelect alumno={alumno} key={alumno._id} />
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="form-group row">
              <label
                htmlFor="inputPassword"
                className="col-sm-2 col-form-label"
              >
                Tipo de nota
              </label>
              <div className="col-sm-6">
                <div className="form-group">
                  <select
                    disabled={isDisabledSelect}
                    name="tipoNota"
                    onChange={handleSelectChange}
                    className="form-control"
                    id="exampleSelect1"
                    value={nota.tipoNota}
                  >
                    <option>PSICOSOMATICO</option>
                    <option>CAP I</option>
                    <option>CAP II</option>
                    <option>CAP III</option>
                    <option>CAP IV</option>
                    <option>EXAMEN FINAL</option>
                  </select>
                </div>
              </div>
              <div className="col-sm-4">
                <div className="form-group">
                  {alumno.nombres ? (
                    <>
                      {" "}
                      Alumno: <strong>{alumno.nombres}</strong>
                    </>
                  ) : (
                    <> </>
                  )}
                  <br />
                  {notas.length === 0 &&
                  nota.estudiante !== "NOSELECT" &&
                  notass.length === 0 ? (
                    <>No hay notas registradas</>
                  ) : (
                    <>
                      {notas.map((nota) => (
                        <NotaAlumnoItem key={nota._id} nota={nota} />
                      ))}

                      {notass.length === 0 ? (
                        <></>
                      ) : (
                        <>
                          <br />
                          <strong>
                            <span>Segundo Intento</span>
                          </strong>
                          <br />
                          {notass.map((nota) => (
                            <NotaAlumnoItemS key={nota._id} nota={nota} />
                          ))}
                        </>
                      )}
                    </>
                  )}
                  <br />
                </div>
              </div>
            </div>
            <div className="form-group row">
              <label
                htmlFor="inputPassword"
                className="col-sm-2 col-form-label"
              >
                Nota
              </label>
              <div className="col-sm-6">
                <div className="form-group">
                  <input
                    disabled={isDisabledInput}
                    value={nota.nota}
                    onChange={handleInputChange}
                    type="text"
                    name="nota"
                    placeholder="Nota"
                    className="form-control"
                  />
                </div>
              </div>
            </div>
            <div className="form-group row">
              <div className="col-sm-2"></div>
              <div className="col-sm-6">
                <button
                  type="submit"
                  disabled={isDisabledButton}
                  className="btn btn-primary"
                  style={{ float: "right", width: "50%" }}
                >
                  Guardar
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default NotasForm;
