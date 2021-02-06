import React, {
  KeyboardEvent,
  useState,
  useEffect,
  useContext,
  ChangeEvent,
  useCallback,
} from "react";
import { Pagos } from "../Pagos/Pagos";
import { Egresos } from "../Egreso/Egresos";
import { CajaIngreso } from "../Caja/CajaItem";
import * as cajaService from "../Caja/CajaService";
import { numberFormat } from "../lib/index";
import moment from "moment";
import MostarSesionTerminada from "../lib/SesionTerminada";
import { UserContext } from "../Context/UserContext";

type InputChange = ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;

interface Props {
  busqueda: Boolean;
  alumnoList?: Boolean;
}

const AlumnosListDeudores = (props: Props) => {
  const { userData, setUserData }: any = useContext(UserContext);

  const { busqueda, alumnoList } = props;
  const [listIngresos, setListIngresos] = useState<Pagos[]>([]);
  const [loading, setLoading] = useState(true);
  const [ingresoTotal, setIngresoTotal] = useState<Number>(0);
  const [filtro, setFiltro] = useState({
    huacho: "",
    huaral: "",
    barranca: "",
    deudores: busqueda,
  });
  var f = new Date();
  var fechaActual =
    f.getFullYear() + "-" + (f.getMonth() + 1) + "-" + f.getDate();
  const [fecha, setFecha] = useState({
    ini: moment(fechaActual).format("YYYY-MM-DD"),
    fin: moment(fechaActual).format("YYYY-MM-DD"),
  });

  const handleCheckedChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFiltro({ ...filtro, [e.target.name]: e.target.checked });
  };

  const handleInputChange = async (e: InputChange) => {
    setFecha({ ...fecha, [e.target.name]: e.target.value });
  };

  const loadFiltro = useCallback(async () => {
    const res = await cajaService.getIngresos();
    if (Boolean(busqueda) === true) {
      if (
        Boolean(busqueda) === true &&
        Boolean(filtro.huacho) === true &&
        Boolean(filtro.huaral) === true &&
        Boolean(filtro.barranca) === true
      ) {
        const ingresos: any = res.data.filter((ingreso: any) =>
          fecha.ini && fecha.fin
            ? moment(ingreso.createdAt).format("YYYY-MM-DD") >= fecha.ini &&
              moment(ingreso.createdAt).format("YYYY-MM-DD") <= fecha.fin &&
              (ingreso.sedes.name === "Huacho" ||
                ingreso.sedes.name === "Huaral" ||
                ingreso.sedes.name === "Barranca") &&
              ingreso.stateRenta == true
            : //ingreso.sedes.name === "Barranca"
              ingreso.sedes.name === "Huacho" ||
              ingreso.sedes.name === "Huaral" ||
              (ingreso.sedes.name === "Barranca" && ingreso.stateRenta == true)
        );

        setListIngresos(
          ingresos.sort((a: any, b: any) => a.confirm - b.confirm)
        );

        const deuda = ingresos
          .map((debe: any) =>
            debe.stateRenta
              ? debe.tramites.costo * debe.cantidad - debe.acuenta
              : 0
          )
          .reduce((a: any, b: any) => a + b, 0);

        setIngresoTotal(deuda);
        setLoading(false);
      } else if (
        Boolean(busqueda) === true &&
        Boolean(filtro.barranca) === true &&
        Boolean(filtro.huacho) === true
      ) {
        const ingresos: any = res.data.filter((ingreso: any) =>
          fecha.ini && fecha.fin
            ? moment(ingreso.createdAt).format("YYYY-MM-DD") >= fecha.ini &&
              moment(ingreso.createdAt).format("YYYY-MM-DD") <= fecha.fin &&
              (ingreso.sedes.name === "Huacho" ||
                ingreso.sedes.name === "Barranca") &&
              ingreso.stateRenta == true
            : ingreso.sedes.name === "Huacho" ||
              (ingreso.sedes.name === "Barranca" && ingreso.stateRenta == true)
        );
        setListIngresos(
          ingresos.sort((a: any, b: any) => a.confirm - b.confirm)
        );

        const deuda = ingresos
          .map((debe: any) =>
            debe.stateRenta
              ? debe.tramites.costo * debe.cantidad - debe.acuenta
              : 0
          )
          .reduce((a: any, b: any) => a + b, 0);

        setIngresoTotal(deuda);
        setLoading(false);
      } else if (
        Boolean(busqueda) === true &&
        Boolean(filtro.huacho) === true &&
        Boolean(filtro.huaral) === true
      ) {
        const ingresos: any = res.data.filter((ingreso: any) =>
          fecha.ini && fecha.fin
            ? moment(ingreso.createdAt).format("YYYY-MM-DD") >= fecha.ini &&
              moment(ingreso.createdAt).format("YYYY-MM-DD") <= fecha.fin &&
              (ingreso.sedes.name === "Huaral" ||
                ingreso.sedes.name === "Huacho") &&
              ingreso.stateRenta == true
            : ingreso.sedes.name === "Huaral" ||
              (ingreso.sedes.name === "Huacho" && ingreso.stateRenta == true)
        );

        setListIngresos(
          ingresos.sort((a: any, b: any) => a.confirm - b.confirm)
        );

        const deuda = ingresos
          .map((debe: any) =>
            debe.stateRenta
              ? debe.tramites.costo * debe.cantidad - debe.acuenta
              : 0
          )
          .reduce((a: any, b: any) => a + b, 0);

        setIngresoTotal(deuda);
        setLoading(false);
      } else if (
        Boolean(busqueda) === true &&
        Boolean(filtro.barranca) === true &&
        Boolean(filtro.huacho) === true
      ) {
        const ingresos: any = res.data.filter((ingreso: any) =>
          fecha.ini && fecha.fin
            ? moment(ingreso.createdAt).format("YYYY-MM-DD") >= fecha.ini &&
              moment(ingreso.createdAt).format("YYYY-MM-DD") <= fecha.fin &&
              (ingreso.sedes.name === "Huacho" ||
                ingreso.sedes.name === "Barranca") &&
              ingreso.stateRenta == true
            : ingreso.sedes.name === "Huacho" ||
              (ingreso.sedes.name === "Barranca" && ingreso.stateRenta == true)
        );

        setListIngresos(
          ingresos.sort((a: any, b: any) => a.confirm - b.confirm)
        );

        const deuda = ingresos
          .map((debe: any) =>
            debe.stateRenta
              ? debe.tramites.costo * debe.cantidad - debe.acuenta
              : 0
          )
          .reduce((a: any, b: any) => a + b, 0);

        setIngresoTotal(deuda);
        setLoading(false);
      } else if (
        Boolean(busqueda) === true &&
        Boolean(filtro.barranca) === true &&
        Boolean(filtro.huaral) === true
      ) {
        const ingresos: any = res.data.filter((ingreso: any) =>
          fecha.ini && fecha.fin
            ? moment(ingreso.createdAt).format("YYYY-MM-DD") >= fecha.ini &&
              moment(ingreso.createdAt).format("YYYY-MM-DD") <= fecha.fin &&
              (ingreso.sedes.name === "Huaral" ||
                ingreso.sedes.name === "Barranca") &&
              ingreso.stateRenta == true
            : ingreso.sedes.name === "Huaral" ||
              (ingreso.sedes.name === "Barranca" && ingreso.stateRenta == true)
        );

        setListIngresos(
          ingresos.sort((a: any, b: any) => a.confirm - b.confirm)
        );

        const deuda = ingresos
          .map((debe: any) =>
            debe.stateRenta
              ? debe.tramites.costo * debe.cantidad - debe.acuenta
              : 0
          )
          .reduce((a: any, b: any) => a + b, 0);

        setIngresoTotal(deuda);
        setLoading(false);
      } else if (
        Boolean(busqueda) === true &&
        Boolean(filtro.barranca) === true
      ) {
        const ingresos: any = res.data.filter((ingreso: any) =>
          fecha.ini && fecha.fin
            ? moment(ingreso.createdAt).format("YYYY-MM-DD") >= fecha.ini &&
              moment(ingreso.createdAt).format("YYYY-MM-DD") <= fecha.fin &&
              ingreso.sedes.name === "Barranca" &&
              ingreso.stateRenta == true
            : //ingreso.sedes.name === "Barranca"
              ingreso.sedes.name === "Ba rranca" && ingreso.stateRenta == true
        );

        setListIngresos(
          ingresos.sort((a: any, b: any) => a.confirm - b.confirm)
        );

        const deuda = ingresos
          .map((debe: any) =>
            debe.stateRenta
              ? debe.tramites.costo * debe.cantidad - debe.acuenta
              : 0
          )
          .reduce((a: any, b: any) => a + b, 0);

        setIngresoTotal(deuda);
        setLoading(false);
      } else if (
        Boolean(busqueda) === true &&
        Boolean(filtro.huaral) === true
      ) {
        const ingresos: any = res.data.filter((ingreso: any) =>
          fecha.ini && fecha.fin
            ? moment(ingreso.createdAt).format("YYYY-MM-DD") >= fecha.ini &&
              moment(ingreso.createdAt).format("YYYY-MM-DD") <= fecha.fin &&
              ingreso.sedes.name === "Huaral" &&
              ingreso.stateRenta == true
            : ingreso.sedes.name === "Huaral" && ingreso.stateRenta == true
        );

        setListIngresos(
          ingresos.sort((a: any, b: any) => a.confirm - b.confirm)
        );

        const deuda = ingresos
          .map((debe: any) =>
            debe.stateRenta
              ? debe.tramites.costo * debe.cantidad - debe.acuenta
              : 0
          )
          .reduce((a: any, b: any) => a + b, 0);

        setIngresoTotal(deuda);
        setLoading(false);
      } else if (
        Boolean(busqueda) === true &&
        Boolean(filtro.huacho) === true
      ) {
        const ingresos: any = res.data.filter((ingreso: any) =>
          fecha.ini && fecha.fin
            ? moment(ingreso.createdAt).format("YYYY-MM-DD") >= fecha.ini &&
              moment(ingreso.createdAt).format("YYYY-MM-DD") <= fecha.fin &&
              ingreso.sedes.name === "Huacho" &&
              ingreso.stateRenta == true
            : ingreso.sedes.name === "Huacho" && ingreso.stateRenta == true
        );

        setListIngresos(
          ingresos.sort((a: any, b: any) => a.confirm - b.confirm)
        );

        const deuda = ingresos
          .map((debe: any) =>
            debe.stateRenta
              ? debe.tramites.costo * debe.cantidad - debe.acuenta
              : 0
          )
          .reduce((a: any, b: any) => a + b, 0);

        setIngresoTotal(deuda);
        setLoading(false);
      } else {
        const ingresos: any = res.data.filter((ingreso: any) =>
          fecha.ini && fecha.fin
            ? moment(ingreso.createdAt).format("YYYY-MM-DD") >= fecha.ini &&
              moment(ingreso.createdAt).format("YYYY-MM-DD") <= fecha.fin &&
              (ingreso.sedes.name === "Huaral" ||
                ingreso.sedes.name === "Barranca" ||
                ingreso.sedes.name === "Huacho") &&
              ingreso.stateRenta == true
            : ingreso.sedes.name === "Huaral" ||
              ingreso.sedes.name === "Barranca" ||
              (ingreso.sedes.name === "Huacho" && ingreso.stateRenta == true)
        );

        setListIngresos(
          ingresos.sort((a: any, b: any) => a.confirm - b.confirm)
        );

        const deuda = ingresos
          .map((debe: any) =>
            debe.stateRenta
              ? debe.tramites.costo * debe.cantidad - debe.acuenta
              : 0
          )
          .reduce((a: any, b: any) => a + b, 0);

        setIngresoTotal(deuda);
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, [
    filtro.huacho,
    filtro.huaral,
    filtro.barranca,
    fecha.ini,
    fecha.fin,
    busqueda,
  ]);

  useEffect(() => {
    loadFiltro();
  }, [loadFiltro]);

  return (
    <>
      <div className="card">
        <div className="card-header">
          {Boolean(busqueda) === true ? <>Deben </> : ""}
          <strong style={{ color: "green" }}>
            {numberFormat(ingresoTotal)}
          </strong>{" "}
        </div>
        <div className="card-body">
          <div className="form-group row">
            <label htmlFor="inputPassword" className="col-sm-2 col-form-label">
              Fecha inicio
            </label>
            <div className="col-sm-2">
              <div className="form-group">
                <input
                  autoFocus
                  type="date"
                  className="form-control"
                  name="ini"
                  value={fecha.ini}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <label htmlFor="inputPassword" className="col-sm-2 col-form-label">
              Fecha fin
            </label>
            <div className="col-sm-2">
              <div className="form-group">
                <input
                  type="date"
                  className="form-control"
                  name="fin"
                  value={fecha.fin}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="col-sm-2">
              <span style={{ float: "right" }}>
                <strong>{listIngresos.length}</strong> faltan cancelar
              </span>
            </div>
          </div>
          <legend>Filtros</legend>
          <div className="form-row">
            <div className="form-group col-sm-4">
              <div className="form-check">
                <label className="form-check-label">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    //defaultChecked
                    name="huacho"
                    onChange={handleCheckedChange}
                    value={String(filtro.huacho)}
                  />
                  Huacho
                </label>
              </div>
            </div>
            <div className="form-group col-sm-4">
              <div className="form-check">
                <label className="form-check-label">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="huaral"
                    onChange={handleCheckedChange}
                    value={String(filtro.huaral)}
                  />
                  Huaral
                </label>
              </div>
            </div>
            <div className="form-group col-sm-2">
              <div className="form-check">
                <label className="form-check-label">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="barranca"
                    onChange={handleCheckedChange}
                    value={String(filtro.barranca)}
                  />
                  Barranca
                </label>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-sm-12">
              <div className="table-responsive">
                {loading ? (
                  <>
                    <div className="col-md-4 offset-md-6">
                      <div className="spinner-grow text-primary" role="status">
                        <span className="sr-only">Loading...</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {listIngresos.length === 0 ? (
                      <>
                        <strong>No hay ingresos</strong>
                        <br />
                        <br />
                      </>
                    ) : (
                      <>
                        <table className="table table-bordered">
                          <thead className="table-success">
                            <tr>
                              <th scope="col">Sede</th>
                              <th scope="col" style={{ width: "10px" }}>
                                COD
                              </th>
                              <th scope="col">Estudiante</th>
                              <th scope="col">Contacto</th>
                              <th scope="col">Secretari@</th>
                              <th scope="col">Tramite</th>
                              <th scope="col" style={{ width: "10px" }}>
                                Recibo
                              </th>
                              <th scope="col">Monto</th>
                              <th scope="col">Debe</th>
                              <th scope="col">Fecha</th>
                              <th scope="col">Estado</th>
                            </tr>
                          </thead>
                          <tbody className="table-light">
                            {listIngresos.map((ingreso) => (
                              <CajaIngreso
                                loadIngresos={loadFiltro}
                                key={ingreso._id}
                                pago={ingreso}
                                alumnoList={true}
                                debe={busqueda}
                              />
                            ))}
                          </tbody>
                        </table>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AlumnosListDeudores;
