import React, {
  FormEvent,
  useContext,
  useState,
  useEffect,
  ChangeEvent,
  useCallback,
} from "react";
import { toast } from "react-toastify";
import { useParams, useHistory } from "react-router-dom";
import { Practicas } from "./Practicas";
import * as practicasService from "./PracticasService";
import { Alumno } from "./../Alumnos/Alumno";
import * as notasService from "../Notas/NotasService";
import AlumnosSelect from "./../Notas/AlumnosSelect";
import PracticasItem from "./PracticaItem";
import { UserContext } from "../Context/UserContext";
import moment from "moment";
import { GoSync } from "react-icons/go";
import MostarSesionTerminada from "../lib/SesionTerminada";

type InputChange = ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;
type SelectChange = ChangeEvent<HTMLSelectElement>;

interface Params {
  id?: string;
}

const HorarioForm = () => {
  const [alumno, setAlumno] = useState<any>({});
  const params: any = useParams<Params>();
  const history = useHistory();
  const { userData }: any = useContext(UserContext);
  const initialState = {
    profesor: userData.id,
    estudiante: "NOSELECT",
    fecha: "",
    horaInicio: "",
    horaSalida: "",
    nro: "NOSELECT",
  };

  const [alumnos, setAlumnos] = useState<Alumno[]>([]);

  const [practicas, setPracticas] = useState<Practicas>(initialState);

  const [listPracticas, setListPracticas] = useState<Practicas[]>([]);

  const loadPracticas = useCallback(async () => {
    const res = await practicasService.getPracticasXAlumno(
      practicas.estudiante
    );
    setListPracticas(res.data);
  }, [practicas.estudiante]);

  const loadAlumno = useCallback(async () => {
    const res = await notasService.getAlumno(practicas.estudiante);
    setAlumno(res.data);
  }, [practicas.estudiante]);

  const loadAlumnos = async () => {
    const res = await notasService.getAlumnos();
    setAlumnos(res.data);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!params.id) {
      try {
        await practicasService.createNewPractica(practicas);
        setPracticas(initialState);
        toast.success("Practica añadida");
        loadPracticas();
      } catch (e) {
        toast.error(JSON.parse(e.request.response).message);
      }
    } else {
      try {
        await practicasService.updatePractica(params.id, practicas);
        toast.success("Practica actualizada");
        loadPracticas();
      } catch (e) {
        toast.error(JSON.parse(e.request.response).message);
      }
    }
  };

  const getPractica = async (id: string) => {
    const res = await practicasService.getPracticaById(id);
    setPracticas(res.data);
  };

  const handleSelectChange = async (e: SelectChange) => {
    if (params.id) {
      history.push("/horariopracticas");
      setPracticas(initialState);
      setAlumno({});
      setListPracticas([]);
    } else {
      setPracticas({
        ...practicas,
        profesor: userData.id,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleInputChange = (e: InputChange) =>
    setPracticas({
      ...practicas,
      [e.target.name]: e.target.value,
    });
  useEffect(() => {
    if (params.id) {
      getPractica(params.id);
    }
  }, [params.id]);
  useEffect(() => {
    loadAlumnos();
    if (practicas.estudiante !== "NOSELECT") {
      loadPracticas();
      loadAlumno();
    }
  }, [params.id, practicas.estudiante, loadAlumno, loadPracticas]);

  return (
    <>
      <div className="card">
        <div className="card-header">
          Horario de practicas
          <GoSync
            onClick={() => {
              setPracticas(initialState);
              history.push("/horariopracticas");
              setAlumno({});
              setListPracticas([]);
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
                Fecha
              </label>
              <div className="col-sm-10">
                <div className="form-group">
                  <input
                    autoFocus
                    type="date"
                    className="form-control"
                    name="fecha"
                    onChange={handleInputChange}
                    value={moment(practicas.fecha).utc().format("YYYY-MM-DD")}
                  />
                </div>
              </div>
            </div>
            <div className="form-group row">
              <label
                htmlFor="inputPassword"
                className="col-sm-2 col-form-label"
              >
                Inicio
              </label>
              <div className="col-sm-4">
                <div className="form-group">
                  <input
                    type="time"
                    className="form-control"
                    name="horaInicio"
                    onChange={handleInputChange}
                    value={practicas.horaInicio}
                  />
                </div>
              </div>
              <label
                htmlFor="inputPassword"
                className="col-sm-2 col-form-label"
              >
                Termina
              </label>
              <div className="col-sm-4">
                <div className="form-group">
                  <input
                    type="time"
                    className="form-control"
                    name="horaSalida"
                    onChange={handleInputChange}
                    value={practicas.horaSalida}
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
                    value={practicas.estudiante}
                    //disabled={}
                    //defaultValue={"NOSELECT"}
                  >
                    <option value="NOSELECT" disabled>
                      Seleccione alumno
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
                Nro de practica
              </label>
              <div className="col-sm-10">
                <div className="form-group">
                  <select
                    name="nro"
                    onChange={handleSelectChange}
                    className="custom-select"
                    value={String(practicas.nro)}
                    //defaultValue={"NOSELECT"}
                  >
                    <option value="NOSELECT" disabled>
                      Seleccione el nro
                    </option>
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                    <option>6</option>
                    <option>7</option>
                    <option>8</option>
                    <option>9</option>
                    <option>10</option>
                    <option>11</option>
                    <option>12</option>
                    <option>13</option>
                    <option>14</option>
                    <option>15</option>
                    <option>16</option>
                    <option>17</option>
                    <option>18</option>
                    <option>19</option>
                    <option>20</option>
                    <option>21</option>
                    <option>22</option>
                  </select>
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
          Practicas de <strong>{alumno.nombres || "Anonimo"}</strong>
        </div>

        <div className="card-body">
          <div className="table-responsive">
            {listPracticas.length === 0 ? (
              <>No hay practicas publicadas.</>
            ) : (
              <>
                <table className="table table-bordered">
                  <thead className="table-info">
                    <tr>
                      <th scope="col">NRO</th>
                      <th scope="col">Profesor</th>
                      <th scope="col">Fecha</th>
                      <th scope="col">Hora Inicio</th>
                      <th scope="col">Hora termino</th>
                      <th scope="col">Alumno</th>
                      <th scope="col">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="table-light">
                    {listPracticas.map((practica) => (
                      <PracticasItem
                        practica={practica}
                        key={practica._id}
                        loadPracticas={loadPracticas}
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

export default HorarioForm;
