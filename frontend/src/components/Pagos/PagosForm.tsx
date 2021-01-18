import React, {
  useContext,
  ChangeEvent,
  useEffect,
  FormEvent,
  useState,
} from "react";
import { GoSync } from "react-icons/go";
import moment from "moment";
import { GoArrowLeft } from "react-icons/go";
import { useHistory, useParams } from "react-router-dom";
import { Pagos } from "./Pagos";
import { toast } from "react-toastify";
import { UserContext } from "../Context/UserContext";
import * as pagosService from "./PagosService";
import { confirmAlert } from "react-confirm-alert"; // Import

type InputChange = ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;

interface Props {
  id: any;
  loadPagos: () => void;
}
interface Params {
  id: string; //?
  idpago: string; //?
}
const PagosForm = (props: Props) => {
  const { id, loadPagos } = props;
  const params: any = useParams<Params>();
  const { userData }: any = useContext(UserContext);
  const initialState = {
    cantidad: "",
    nroRecibo: "",
    //fecha: new Date(),
    estudiante: id,
    registrador: userData.id,
  };

  const history = useHistory();

  const [pago, setPago] = useState<Pagos>(initialState);

  const handleInputChange = (e: InputChange) =>
    setPago({ ...pago, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    //e.preventDefault();
    if (!params.idpago) {
      try {
        await pagosService.createNewPagos(pago);
        loadPagos();
        toast.success("Pago añadido");
        setPago(initialState);
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
        await pagosService.updatePagos(params.idpago, pago);
        loadPagos();
        toast.success("Pago actualizado");
      } catch (e) {
        history.push("/alumnos");
        return toast.error(JSON.parse(e.request.response).message);
      }
    }
  };

  const modalComfirmarRegistro = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    confirmAlert({
      title: "Mensaje",
      message: "Esta seguro que desea agregar al pago ?",
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
  const getPago = async (id: string) => {
    const res = await pagosService.getPago(id);
    setPago(res.data);
  };

  useEffect(() => {
    loadPagos();
    setPago({ ...pago, registrador: userData.id });
    if (params.idpago) getPago(params.idpago);
  }, [params.idpago, userData.id]);
  //isClickObservation
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
                <h4>Registro de pago</h4>
              </div>
              <div className="col-6">
                <a
                  style={{
                    position: "absolute",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    setPago(initialState);
                    history.push(`/alumnos/pagos/${params.id}`);
                  }}
                >
                  <GoSync /> Refresh
                </a>
              </div>
            </div>
            <br />
            <form onSubmit={modalComfirmarRegistro}>
              {params.idpago ? (
                <>
                  {userData.role === "Super Admin" ? (
                    <>
                      <div className="form-group">
                        <input
                          type="text"
                          name="cantidad"
                          placeholder="Cantidad"
                          className="form-control"
                          autoFocus
                          onChange={handleInputChange}
                          value={pago.cantidad}
                        />
                      </div>

                      <div className="form-group">
                        <input
                          type="text"
                          name="nroRecibo"
                          placeholder="Nro Recibo"
                          className="form-control"
                          onChange={handleInputChange}
                          value={pago.nroRecibo}
                        />
                      </div>

                      {/**
                         * <div className="form-group">
                        <input
                          type="date"
                          name="fecha"
                          className="form-control"
                          onChange={handleInputChange}
                          value={moment(pago.fecha).format("YYYY-MM-DD")}
                        />
                      </div>
                         */}
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
                          value={pago.observacion}
                        ></textarea>
                      </div>
                    </>
                  )}
                </>
              ) : (
                <>
                  <div className="form-group">
                    <input
                      type="text"
                      name="cantidad"
                      placeholder="Cantidad"
                      className="form-control"
                      autoFocus
                      onChange={handleInputChange}
                      value={pago.cantidad}
                    />
                  </div>

                  <div className="form-group">
                    <input
                      type="text"
                      name="nroRecibo"
                      placeholder="Nro Recibo"
                      className="form-control"
                      onChange={handleInputChange}
                      value={pago.nroRecibo}
                    />
                  </div>

                  {/**
                     * <div className="form-group">
                    <input
                      type="date"
                      name="fecha"
                      className="form-control"
                      onChange={handleInputChange}
                      value={moment(pago.fecha).format("YYYY-MM-DD")}
                    />
                  </div>
                     * 
                     */}
                </>
              )}

              {params.idpago ? (
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

export default PagosForm;
