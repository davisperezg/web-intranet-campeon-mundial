import React, {
  ChangeEvent,
  useContext,
  useState,
  useEffect,
  FormEvent,
} from "react";
import { useHistory, useParams } from "react-router-dom";
import { Documentos } from "./Documentos";
import * as documentoService from "./DocumentosService";
import { toast } from "react-toastify";
import { GoArrowLeft } from "react-icons/go";
import moment from "moment";
import { GoSync } from "react-icons/go";
import { UserContext } from "../Context/UserContext";
import { confirmAlert } from "react-confirm-alert"; // Import
import MostarSesionTerminada from "../lib/SesionTerminada";

type InputChange = ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;

interface Props {
  id: any;
  loadDocumentos: () => void;
}
interface Params {
  id?: string;
  iddocumento?: string;
}
const DocumentosForm = (props: Props) => {
  const { id, loadDocumentos } = props;

  const params = useParams<Params>();
  const { userData }: any = useContext(UserContext);
  const initialState = {
    fechaEntregaBalotario: "",
    fechaEntregaCertificadoMedico: "",
    fechaEntregaCertificadoCofipro: "",
    fechaEntregaCarnet: "",
    fechaEntregaGuiaManejo: "",
    fechaEntregaActa: "",
    estudiante: id,
  };
  const history = useHistory();

  const [documento, setDocumento] = useState<Documentos>(initialState);

  const handleInputChange = (e: InputChange) =>
    setDocumento({ ...documento, [e.target.name]: e.target.value });

  const getDocumento = async (id: string) => {
    const res = await documentoService.getDocumento(id);
    setDocumento(res.data);
  };

  const handleSubmit = async () => {
    //e.preventDefault();
    if (!params.iddocumento) {
      try {
        await documentoService.createNewDocumentos(documento);
        loadDocumentos();
        toast.success("Documento añadido");
        setDocumento(initialState);
      } catch (e) {
        if (e.request.status === 404) {
          toast.error("Ocurrio un problema vuelva a buscar al alumno");
          return history.push("/alumnos");
        }
        //console.log(JSON.parse(e.request.response));
        toast.error(JSON.parse(e.request.response).message);
      }
    } else {
      try {
        await documentoService.updateDocumentos(params.iddocumento, documento);
        loadDocumentos();
        toast.success("Documento actualizado");
      } catch (e) {
        console.log(e);
      }
    }
  };
  const modalComfirmarRegistro = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    confirmAlert({
      title: "Mensaje",
      message: "Esta seguro que desea agregar al documento ?",
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
    loadDocumentos();
    if (params.iddocumento) getDocumento(params.iddocumento);
  }, [params.iddocumento]);

  return (
    <>
      <div className="col-md-12">
        <div className="card my-auto">
          <GoArrowLeft
            onClick={() => {
              history.push("/alumnos");
            }}
            className="my-2"
            style={{
              cursor: "pointer",
              fontSize: "20px",
              position: "absolute",
              marginLeft: "90%",
            }}
          />
          <div className="card-body">
            <div className="row">
              <div className="col-auto">
                <h4>Registro fecha de entregas</h4>
              </div>
              <div className="col-6">
                <a
                  style={{
                    position: "absolute",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    setDocumento(initialState);
                    history.push(`/alumnos/fecha/documentos/${params.id}`);
                  }}
                >
                  <GoSync /> Refresh
                </a>
              </div>
            </div>
            <br />
            <br />
            <form onSubmit={modalComfirmarRegistro}>
              {params.iddocumento ? (
                <>
                  {userData.role === "Super Admin" ? (
                    <>
                      <div className="form-group">
                        <label className="form-label">F.E Balotario</label>
                        <input
                          type="date"
                          name="fechaEntregaBalotario"
                          className="form-control"
                          onChange={handleInputChange}
                          value={moment(documento.fechaEntregaBalotario)
                            .utc()
                            .format("YYYY-MM-DD")}
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">
                          F.E Certificado medico
                        </label>
                        <input
                          type="date"
                          name="fechaEntregaCertificadoMedico"
                          className="form-control"
                          onChange={handleInputChange}
                          value={moment(documento.fechaEntregaCertificadoMedico)
                            .utc()
                            .format("YYYY-MM-DD")}
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">
                          F.E Certificado cofipro
                        </label>
                        <input
                          type="date"
                          name="fechaEntregaCertificadoCofipro"
                          className="form-control"
                          onChange={handleInputChange}
                          value={moment(
                            documento.fechaEntregaCertificadoCofipro
                          )
                            .utc()
                            .format("YYYY-MM-DD")}
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">F.E Carnet</label>
                        <input
                          type="date"
                          name="fechaEntregaCarnet"
                          className="form-control"
                          onChange={handleInputChange}
                          value={moment(documento.fechaEntregaCarnet)
                            .utc()
                            .format("YYYY-MM-DD")}
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">F.E Guia manejo</label>
                        <input
                          type="date"
                          name="fechaEntregaGuiaManejo"
                          className="form-control"
                          onChange={handleInputChange}
                          value={moment(documento.fechaEntregaGuiaManejo)
                            .utc()
                            .format("YYYY-MM-DD")}
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">F.E Acta</label>
                        <input
                          type="date"
                          name="fechaEntregaActa"
                          className="form-control"
                          onChange={handleInputChange}
                          value={moment(documento.fechaEntregaActa)
                            .utc()
                            .format("YYYY-MM-DD")}
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="form-group">
                        <textarea
                          name="observacion"
                          rows={3}
                          className="form-control"
                          placeholder="Observación"
                          onChange={handleInputChange}
                          value={documento.observacion}
                        ></textarea>
                      </div>
                    </>
                  )}
                </>
              ) : (
                <>
                  <div className="form-group">
                    <label className="form-label">F.E Balotario</label>
                    <input
                      type="date"
                      name="fechaEntregaBalotario"
                      className="form-control"
                      onChange={handleInputChange}
                      value={moment(documento.fechaEntregaBalotario)
                        .utc()
                        .format("YYYY-MM-DD")}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">F.E Certificado medico</label>
                    <input
                      type="date"
                      name="fechaEntregaCertificadoMedico"
                      className="form-control"
                      onChange={handleInputChange}
                      value={moment(documento.fechaEntregaCertificadoMedico)
                        .utc()
                        .format("YYYY-MM-DD")}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      F.E Certificado cofipro
                    </label>
                    <input
                      type="date"
                      name="fechaEntregaCertificadoCofipro"
                      className="form-control"
                      onChange={handleInputChange}
                      value={moment(documento.fechaEntregaCertificadoCofipro)
                        .utc()
                        .format("YYYY-MM-DD")}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">F.E Carnet</label>
                    <input
                      type="date"
                      name="fechaEntregaCarnet"
                      className="form-control"
                      onChange={handleInputChange}
                      value={moment(documento.fechaEntregaCarnet)
                        .utc()
                        .format("YYYY-MM-DD")}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">F.E Guia manejo</label>
                    <input
                      type="date"
                      name="fechaEntregaGuiaManejo"
                      className="form-control"
                      onChange={handleInputChange}
                      value={moment(documento.fechaEntregaGuiaManejo)
                        .utc()
                        .format("YYYY-MM-DD")}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">F.E Acta</label>
                    <input
                      type="date"
                      name="fechaEntregaActa"
                      className="form-control"
                      onChange={handleInputChange}
                      value={moment(documento.fechaEntregaActa)
                        .utc()
                        .format("YYYY-MM-DD")}
                    />
                  </div>
                </>
              )}

              {params.iddocumento ? (
                <button className="btn btn-info" style={{ width: "100%" }}>
                  Actualizar
                </button>
              ) : (
                <button className="btn btn-primary" style={{ width: "100%" }}>
                  Guardar
                </button>
              )}
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default DocumentosForm;
