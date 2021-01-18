import React, {
  useState,
  useContext,
  ChangeEvent,
  useEffect,
  FormEvent,
} from "react";
import { useHistory, useParams } from "react-router-dom";
import { Cita } from "./Cita";
import { Alumno } from "./../Alumnos/Alumno";
import * as notasService from "../Notas/NotasService";
import AlumnosSelect from "./../Notas/AlumnosSelect";
import moment from "moment";
import { GoArrowLeft } from "react-icons/go";
import * as citaService from "./CitaService";
import { toast } from "react-toastify";
import { UserContext } from "../Context/UserContext";

type SelectChange = ChangeEvent<HTMLSelectElement>;
type InputChange = ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;

interface Params {
  id?: string;
}

const CitaForm = () => {
  const { userData }: any = useContext(UserContext);

  const initialState = {
    estudiante: "NOSELECT",
    registrador: userData.id,
    fecha: new Date(),
  };

  const history = useHistory();

  const params = useParams<Params>();

  const [cita, setCita] = useState<Cita>(initialState);

  const [alumnos, setAlumnos] = useState<Alumno[]>([]);

  const loadAlumnos = async () => {
    const res = await notasService.getAlumnos();
    setAlumnos(res.data);
  };

  const getCita = async (id: string) => {
    const res = await citaService.getCitaById(id);
    const { fecha, registrador, estudiante } = res.data;
    setCita({ fecha, registrador, estudiante });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!params.id) {
      try {
        await citaService.createNewCita(cita);
        setCita(initialState);
        toast.success("Cita añadida");
        history.push("/citas");
      } catch (e) {
        toast.error(JSON.parse(e.request.response).message);
      }
    } else {
      try {
        await citaService.updateCita(params.id, cita);
        toast.success("Cita actualizada");
        history.push("/citas");
      } catch (e) {
        console.log(e);
      }
    }
  };

  const handleSelectChange = async (e: SelectChange) => {
    setCita({ ...cita, [e.target.name]: e.target.value });
  };

  const handleInputChange = (e: InputChange) =>
    setCita({ ...cita, [e.target.name]: e.target.value });

  useEffect(() => {
    setCita({ ...cita, registrador: userData.id });
    if (params.id) getCita(params.id);
    loadAlumnos();
  }, [params.id, userData.id]);
  return (
    <>
      <div className="row">
        <div className="col-md-6 offset-md-4">
          <div className="card">
            <div className="card-header">
              Registro de cita
              <GoArrowLeft
                onClick={() => {
                  history.push("/citas");
                }}
                style={{
                  cursor: "pointer",
                  fontSize: "20px",
                  float: "right",
                }}
              />
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="col-sm-12">
                  <div className="form-group">
                    <select
                      autoFocus={true}
                      name="estudiante"
                      onChange={handleSelectChange}
                      className="custom-select"
                      value={String(cita.estudiante)}
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
                <div className="col-sm-12">
                  <div className="form-group">
                    <input
                      type="datetime-local"
                      name="fecha"
                      className="form-control"
                      onChange={handleInputChange}
                      value={moment(cita.fecha).format("YYYY-MM-DDTkk:mm")}
                    />
                  </div>
                </div>
                <div className="col-sm-12">
                  {params.id ? (
                    <button
                      type="submit"
                      className="btn btn-info"
                      style={{ width: "100%" }}
                    >
                      Actualizar
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="btn btn-primary"
                      style={{ width: "100%" }}
                    >
                      Guardar
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CitaForm;
