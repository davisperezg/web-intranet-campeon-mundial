import React, {
  useCallback,
  useState,
  ChangeEvent,
  useEffect,
  FormEvent,
  useContext,
} from "react";
import AlumnosSelect from "./../Notas/AlumnosSelect";
import { Alumno } from "./../Alumnos/Alumno";
import { useParams, useHistory } from "react-router-dom";
import { Asistencia } from "./Asistencia";
import * as notasService from "../Notas/NotasService";
import { toast } from "react-toastify";
import * as asistenciaService from "./AsistenciaService";
import AsistenciaItem from "./AsistenciaItem";
import { GoSync } from "react-icons/go";
import moment from "moment";
import { UserContext } from "../Context/UserContext";
import MostarSesionTerminada from "../lib/SesionTerminada";

type InputChange = ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;
type SelectChange = ChangeEvent<HTMLSelectElement>;
interface Params {
  id?: string;
}

const AsistenciaForm = () => {
  const initialState = {
    estudiante: "NOSELECT",
    ingreso: "",
    capitulo: "",
    salida: "",
  };
  const { userData }: any = useContext(UserContext);
  const history = useHistory();
  const params: any = useParams<Params>();
  const [listAsistencias, setListAsistencia] = useState<Asistencia[]>([]);
  const [alumno, setAlumno] = useState<any>({});
  const [alumnos, setAlumnos] = useState<Alumno[]>([]);
  const [asistenciaIngreso, setAsistenciaIngreso] = useState<Asistencia>(
    initialState
  );

  const loadAsistencias = useCallback(async () => {
    const res = await asistenciaService.getAsistenciaXAlumno(
      asistenciaIngreso.estudiante
    );

    setListAsistencia(res.data);
  }, [asistenciaIngreso.estudiante]);

  const loadAlumno = useCallback(async () => {
    const res = await notasService.getAlumno(asistenciaIngreso.estudiante);
    setAlumno(res.data);
  }, [asistenciaIngreso.estudiante]);

  const loadAlumnos = async () => {
    const res = await notasService.getAlumnos();
    setAlumnos(res.data);
  };

  const handleSelectChange = async (e: SelectChange) => {
    if (params.id) {
      history.push("/asistencia");
      setAsistenciaIngreso(initialState);
      setAlumno({});
      setListAsistencia([]);
    } else {
      setAsistenciaIngreso({
        ...asistenciaIngreso,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleInputChange = (e: InputChange) =>
    setAsistenciaIngreso({
      ...asistenciaIngreso,
      [e.target.name]: e.target.value,
    });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!params.id) {
      try {
        await asistenciaService.createAsistencia(asistenciaIngreso);
        setAsistenciaIngreso(initialState);
        loadAsistencias();
        toast.success("Asistencia completada");
      } catch (e) {
        console.log(e.request);
        toast.error(JSON.parse(e.request.response).message);
      }
    } else {
      try {
        await asistenciaService.updateAsistencia(params.id, asistenciaIngreso);
        toast.success("Asistencia actualizada");
        loadAsistencias();
      } catch (e) {
        toast.error(JSON.parse(e.request.response).message);
      }
    }
  };

  const getAsistencia = async (id: string) => {
    const res = await asistenciaService.getAsistenciaById(id);
    setAsistenciaIngreso(res.data);
  };

  useEffect(() => {
    if (params.id) {
      getAsistencia(params.id);
    }
  }, [params.id]);

  useEffect(() => {
    loadAlumnos();
    if (asistenciaIngreso.estudiante !== "NOSELECT") {
      loadAsistencias();
      loadAlumno();
    }
  }, [params.id, loadAsistencias, loadAlumno, asistenciaIngreso.estudiante]);

  return (
    <>
      <div className="card">
        <div className="card-header">
          Asistencia teoria y libros{" "}
          <GoSync
            onClick={() => {
              setAsistenciaIngreso(initialState);
              history.push("/asistencia");
              setAlumno({});
              setListAsistencia([]);
            }}
            className="offset-md-11 offset-sm-11"
            style={{
              cursor: "pointer",
              position: "absolute",
              top: "10px",
              left: "40px",
            }}
          />
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group row">
              <label
                htmlFor="inputPassword"
                className="col-sm-2 col-form-label"
              >
                Fecha y hora de ingreso
              </label>
              <div className="col-sm-10">
                <div className="form-group">
                  <input
                    autoFocus
                    type="datetime-local"
                    className="form-control"
                    name="ingreso"
                    onChange={handleInputChange}
                    value={moment(asistenciaIngreso.ingreso)
                      .utc()
                      .format("YYYY-MM-DDTkk:mm")}
                  />
                </div>
              </div>
            </div>
            <div className="form-group row">
              <label
                htmlFor="inputPassword"
                className="col-sm-2 col-form-label"
              >
                Fecha y hora de salida
              </label>
              <div className="col-sm-10">
                <div className="form-group">
                  <input
                    type="datetime-local"
                    className="form-control"
                    name="salida"
                    onChange={handleInputChange}
                    value={moment(asistenciaIngreso.salida)
                      .utc()
                      .format("YYYY-MM-DDTkk:mm")}
                  />
                </div>
              </div>
            </div>
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
                    name="estudiante"
                    onChange={handleSelectChange}
                    className="custom-select"
                    //disabled={}
                    value={asistenciaIngreso.estudiante}
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
                Capitulo
              </label>
              <div className="col-sm-10">
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    name="capitulo"
                    onChange={handleInputChange}
                    value={asistenciaIngreso.capitulo}
                  />
                </div>
              </div>
            </div>
            <div className="form-group row">
              <div className="col-sm-2"></div>
              <div className="col-sm-6">
                {params.id ? (
                  <>
                    <button
                      type="submit"
                      className="btn btn-info"
                      style={{ float: "right", width: "50%" }}
                    >
                      Actualizar
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      style={{ float: "right", width: "50%" }}
                    >
                      Guardar
                    </button>
                  </>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
      <br />

      <div className="card">
        <div className="card-header">
          Asistencia de <strong>{alumno.nombres || "Anonimo"}</strong>
        </div>

        <div className="card-body">
          <div className="table-responsive">
            {listAsistencias.length === 0 ? (
              <>No hay practicas publicadas.</>
            ) : (
              <>
                <table className="table table-bordered">
                  <thead className="table-info">
                    <tr>
                      <th scope="col">Fecha y hora de ingreso</th>
                      <th scope="col">Fecha y hora de salida</th>
                      <th scope="col">Alumno</th>
                      <th scope="col">Capitulo</th>
                      {userData.role === "Estudiante" ? (
                        <></>
                      ) : (
                        <>
                          <th scope="col">Acciones</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody className="table-light">
                    {listAsistencias.map((asistencia) => (
                      <AsistenciaItem
                        asistencia={asistencia}
                        key={asistencia._id}
                        loadAsistencias={loadAsistencias}
                      />
                    ))}
                  </tbody>
                </table>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AsistenciaForm;
