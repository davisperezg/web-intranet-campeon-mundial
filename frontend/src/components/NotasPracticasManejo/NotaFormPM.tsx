import React, {
  useState,
  useContext,
  ChangeEvent,
  useEffect,
  FormEvent,
} from "react";
import { GoArrowLeft } from "react-icons/go";
import { useHistory, useParams } from "react-router-dom";
import { UserContext } from "../Context/UserContext";
import { NotasPracticaManejo } from "./NotasPracticasManejo";
import * as notasPracticasService from "./NotasPracticaManejoService";
import { toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert"; // Import
import MostarSesionTerminada from "./../lib/SesionTerminada";
import * as alumnoService from "../Alumnos/AlumnoService";
import { Alumno } from "./../Alumnos/Alumno";

interface Params {
  id?: string;
}

type InputChange = ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;
type SelectChange = ChangeEvent<HTMLSelectElement>;

const NotasFormPM = () => {
  const { userData }: any = useContext(UserContext);
  const params = useParams<Params>();
  const [alumno, setAlumno]: any = useState([]);
  const initialvalue = {
    etapa: "ETAPA1 FASEA",
    estadoAlumno: "APROBADO",
    registrador: String(userData.id),
    estudiante: String(params.id),
  };

  const getAlumno = async (id: string) => {
    const res: any = await alumnoService.getAlumno(id);
    setAlumno(res.data);
  };
  const history = useHistory();

  const [nota, setNota] = useState<NotasPracticaManejo>(initialvalue);

  const handleInputChange = (e: InputChange) =>
    setNota({
      ...nota,
      [e.target.name]: e.target.value,
    });
  const handleSelectChange = async (e: SelectChange) => {
    setNota({ ...nota, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await notasPracticasService.createNewNotaPractica(nota);
      setNota(initialvalue);
      toast.success("Nota registrada");
      //loadPromedio();
    } catch (e) {
      //console.log(e.request.response);
      //console.log(JSON.parse(e.request.response).keyValue);
      toast.error(
        JSON.parse(e.request.response).keyValue.etapa + ". Ya está registrado"
      );
    }
  };

  const modalComfirmar = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
  };

  useEffect(() => {
    if (params.id) getAlumno(params.id);
    setNota({ ...nota, registrador: userData.id });
  }, [params.id, userData.id]);

  return (
    <>
      <div className="row">
        <div className="col-sm-12">
          <div className="card">
            <div className="card-header">
              Notas de manejo de <strong>{alumno.nombres}</strong>
              <GoArrowLeft
                className="offset-md-11 offset-sm-11"
                onClick={() => {
                  history.push("/alumnos");
                }}
                style={{
                  cursor: "pointer",
                  float: "right",
                  fontSize: "20px",
                  position: "absolute",
                  left: "50px",
                }}
              />
            </div>
            <div className="card-body">
              <form onSubmit={modalComfirmar}>
                <div className="form-group row">
                  <label
                    htmlFor="inputEtapa"
                    className="col-sm-2 col-form-label"
                  >
                    Etapas
                  </label>
                  <div className="col-sm-10">
                    <div className="form-group">
                      <select
                        autoFocus={true}
                        name="etapa"
                        onChange={handleSelectChange}
                        className="custom-select"
                        value={String(nota.etapa)}
                        //defaultValue={"NOSELECT"}
                      >
                        <option value="ETAPA1 FASEA">ETAPA 1 - FASE A</option>
                        <option value="ETAPA1 FASEB">ETAPA 1 - FASE B</option>
                        <option value="ETAPA2">ETAPA 2</option>
                        <option value="ETAPA3">ETAPA 3</option>
                        <option value="ETAPA4">ETAPA 4</option>
                      </select>
                    </div>
                  </div>

                  <label
                    htmlFor="inputEstado"
                    className="col-sm-2 col-form-label"
                  >
                    Estado
                  </label>
                  <div className="col-sm-10">
                    <div className="form-group">
                      <select
                        name="estadoAlumno"
                        onChange={handleSelectChange}
                        className="custom-select"
                        value={String(nota.estadoAlumno)}
                        //defaultValue={"NOSELECT"}
                      >
                        <option value="APROBADO">APROBADO</option>
                        <option value="DESAPROBADO">DESAPROBADO</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-sm-2"></div>
                  <div className="col-sm-10">
                    <button
                      style={{ width: "50%", float: "right" }}
                      className="btn btn-info"
                    >
                      Registrar
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotasFormPM;
