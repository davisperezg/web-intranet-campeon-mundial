import React, {
  useContext,
  ChangeEvent,
  useEffect,
  FormEvent,
  useCallback,
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
import { Tramites } from "./../Tramites/Tramites";
import TramiteItem from "./../Alumnos/TramiteItem";
import * as alumnoService from "../Alumnos/AlumnoService";
import { PagoContext } from "../Context/PagoContext";
import MostarSesionTerminada from "../lib/SesionTerminada";
import { numberFormat } from "./../lib/index";

type InputChange = ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;
type SelectChange = ChangeEvent<HTMLSelectElement>;

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
  const { edit, setEdit }: any = useContext(PagoContext);
  const [total, setTotal] = useState<Number>(0);
  const [resta, setResta] = useState<Number>(0);

  const initialState = {
    cantidad: 1,
    nroRecibo: 0,
    tramites: "",
    estudiante: id,
    registrador: userData.id,
    stateRenta: false,
    acuenta: 0,
  };
  //loadEdit();
  const history = useHistory();
  const [tramite, setTramite] = useState<Tramites[]>([]);
  const [pago, setPago] = useState<Pagos>(initialState);
  const [pagado, setPagado] = useState<Boolean>(false);

  const handleInputChange = (e: InputChange) =>
    setPago({ ...pago, [e.target.name]: e.target.value });

  const handleSelectChangeTramite = (e: SelectChange) =>
    setPago({ ...pago, [e.target.name]: e.target.value });

  const handleCheckedChange = (e: ChangeEvent<HTMLInputElement>) =>
    setPago({ ...pago, [e.target.name]: e.target.checked });

  const getTramites = async () => {
    const res: any = await alumnoService.getTramites();
    setTramite(res.data);
    //console.log(res.data);
  };

  const handleSubmit = async () => {
    //e.preventDefault();
    if (!params.idpago) {
      try {
        await pagosService.createNewPagos(pago);
        loadPagos();
        toast.success("Pago añadido");
        setPago(initialState);
      } catch (e) {
        toast.error(JSON.parse(e.request.response).message);
      }
    } else {
      try {
        await pagosService.updatePagos(params.idpago, pago);
        loadPagos();
        toast.success("Pago actualizado");
      } catch (e) {
        //history.push("/alumnos");
        toast.error(JSON.parse(e.request.response).message);
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
    //console.log(res.data);
    setPago({
      ...res.data,
      tramites: res.data.tramites.name,
      registrador: userData.id,
    });
    if (res.data.acuenta === res.data.tramites.costo) {
      setPagado(true);
    } else {
      setPagado(false);
    }
  };
  const calcTotal = useCallback(async () => {
    const res: any = await alumnoService.getTramites();
    const tramite = res.data
      .filter((tramite: any) => tramite.name === pago.tramites)
      .map((item: any) => item.costo);
    let sumaTotal = Number(tramite) * Number(pago.cantidad);
    let restaTotal = Number(pago.acuenta)
      ? sumaTotal - Number(pago.acuenta)
      : 0;
    setTotal(sumaTotal);
    setResta(restaTotal);
  }, [pago.tramites, pago.cantidad, pago.acuenta]);

  useEffect(() => {
    calcTotal();
    loadPagos();
    getTramites();
    setPago({ ...pago, registrador: userData.id });
    if (params.idpago) getPago(params.idpago);
  }, [calcTotal, params.idpago, userData.id]);

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
              marginLeft: "96.5%",
            }}
          />
          <div className="card-body">
            <div className="row">
              <div className="col-auto">
                {pago._id ? (
                  <>
                    {pagado ? (
                      <>
                        <h4>PAGO COMPLETO</h4>
                      </>
                    ) : (
                      <>
                        <h4>Actualizar pago</h4>
                      </>
                    )}
                  </>
                ) : (
                  <h4>Registrar pago</h4>
                )}
              </div>
              <div className="col-6">
                <a
                  style={{
                    position: "absolute",
                    cursor: "pointer",
                    marginTop: "5px",
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
                      {pagado ? (
                        <>EL TRAMITE ESTÁ PAGADO</>
                      ) : (
                        <>
                          <div className="form-group">
                            <div className="custom-control custom-checkbox">
                              <input
                                type="checkbox"
                                className="custom-control-input"
                                id="customCheck1"
                                onChange={handleCheckedChange}
                                name="stateRenta"
                                checked={Boolean(pago.stateRenta)}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="customCheck1"
                              >
                                El alumno está dejando dinero a cuenta ?
                              </label>
                            </div>
                          </div>
                          {pago.stateRenta ? (
                            <>
                              <div className="form-group">
                                <label htmlFor="exampleSelect1">
                                  Añadir monto
                                </label>
                                <input
                                  autoComplete="off"
                                  type="text"
                                  name="nuevoMonto"
                                  placeholder="Nuevo monto"
                                  className="form-control"
                                  onChange={handleInputChange}
                                />
                              </div>
                            </>
                          ) : pago.acuenta ? (
                            (pago.acuenta = 0)
                          ) : pago.acuenta === 0 ? (
                            ""
                          ) : (
                            ""
                          )}
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      {edit ? (
                        <>
                          {pagado ? (
                            <>EL TRAMITE ESTÁ PAGADO</>
                          ) : (
                            <>
                              <div className="form-group">
                                <div className="custom-control custom-checkbox">
                                  <input
                                    type="checkbox"
                                    className="custom-control-input"
                                    id="customCheck1"
                                    onChange={handleCheckedChange}
                                    name="stateRenta"
                                    checked={Boolean(pago.stateRenta)}
                                  />
                                  <label
                                    className="custom-control-label"
                                    htmlFor="customCheck1"
                                  >
                                    El alumno está dejando dinero a cuenta ?
                                  </label>
                                </div>
                              </div>
                              {pago.stateRenta ? (
                                <>
                                  <div className="form-group">
                                    <label htmlFor="exampleSelect1">
                                      Añadir monto
                                    </label>
                                    <input
                                      autoComplete="off"
                                      type="text"
                                      name="nuevoMonto"
                                      placeholder="Nuevo monto"
                                      className="form-control"
                                      onChange={handleInputChange}
                                    />
                                  </div>
                                </>
                              ) : pago.acuenta ? (
                                (pago.acuenta = 0)
                              ) : pago.acuenta === 0 ? (
                                ""
                              ) : (
                                ""
                              )}
                            </>
                          )}
                        </>
                      ) : (
                        <>
                          <div className="form-group">
                            <textarea
                              autoFocus
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
                  )}
                </>
              ) : (
                <>
                  <div className="form-group">
                    <label htmlFor="exampleSelect1">Tramite</label>
                    <select
                      autoFocus
                      className="form-control"
                      id="exampleSelect1"
                      name="tramites"
                      onChange={handleSelectChangeTramite}
                      value={pago.tramites}
                    >
                      <option value={""} disabled>
                        Seleccione un tramite
                      </option>
                      {tramite.map((tramite) => (
                        <TramiteItem tramite={tramite} key={tramite._id} />
                      ))}
                    </select>
                  </div>
                  <div className="row">
                    <div className="form-group col-md-6">
                      <label htmlFor="exampleSelect1">Unidades</label>
                      <input
                        autoComplete="off"
                        type="text"
                        name="cantidad"
                        placeholder="Unidades"
                        className="form-control"
                        onChange={handleInputChange}
                        value={Number(pago.cantidad)}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="exampleSelect1">Total</label>
                      <input
                        type="text"
                        placeholder="Buscar tramite"
                        className="form-control"
                        disabled={true}
                        //onChange={handleInputChangePago}
                        value={numberFormat(Number(total))}
                      />
                    </div>
                    <div className="form-group col-md-4">
                      <label htmlFor="exampleSelect1">Resta</label>
                      <input
                        type="text"
                        placeholder="Buscar tramite"
                        className="form-control"
                        disabled={true}
                        //onChange={handleInputChangePago}
                        value={
                          Number(resta) < 0
                            ? "El monto a cuenta no puede ser mayor al TOTAL"
                            : numberFormat(Number(resta))
                        }
                      />
                    </div>
                    <div className="form-group col-md-6">
                      <label htmlFor="exampleSelect1">Nº Recibo</label>
                      <input
                        autoComplete="off"
                        type="text"
                        name="nroRecibo"
                        placeholder="Nro Recibo"
                        className="form-control"
                        onChange={handleInputChange}
                        value={Number(pago.nroRecibo)}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="custom-control custom-checkbox">
                      <input
                        type="checkbox"
                        className="custom-control-input"
                        id="customCheck1"
                        onChange={handleCheckedChange}
                        name="stateRenta"
                        checked={Boolean(pago.stateRenta)}
                      />
                      <label
                        className="custom-control-label"
                        htmlFor="customCheck1"
                      >
                        El alumno está dejando dinero a cuenta ?
                      </label>
                    </div>
                  </div>
                  {pago.stateRenta ? (
                    <>
                      <div className="form-group">
                        <label htmlFor="exampleSelect1">Monto a cuenta</label>
                        <input
                          autoComplete="off"
                          type="text"
                          name="acuenta"
                          value={Number(pago.acuenta)}
                          placeholder="Dinero a cuenta"
                          className="form-control"
                          onChange={handleInputChange}
                        />
                      </div>
                    </>
                  ) : pago.acuenta ? (
                    (pago.acuenta = 0)
                  ) : pago.acuenta === 0 ? (
                    ""
                  ) : (
                    ""
                  )}
                </>
              )}

              {params.idpago ? (
                <>
                  {pagado ? (
                    <></>
                  ) : (
                    <>
                      <button
                        className="btn btn-info"
                        style={{ width: "100%" }}
                      >
                        Actualizar
                      </button>
                    </>
                  )}
                </>
              ) : (
                <button className="btn btn-primary" style={{ width: "100%" }}>
                  Registrar
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
