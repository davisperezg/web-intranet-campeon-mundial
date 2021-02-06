import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import { Egresos } from "./Egresos";
import * as egresoService from "./EgresoSerivce";
import EgresoItem from "./EgresoItem";
import moment from "moment";
import { numberFormat } from "../lib/index";
import { UserContext } from "../Context/UserContext";
import MostarSesionTerminada from "../lib/SesionTerminada";

const EgresoList = () => {
  const [loading, setLoading] = useState(true);
  const { userData }: any = useContext(UserContext);
  const history = useHistory();
  const [listEgresos, setListEgresos] = useState<Egresos[]>([]);
  const [costoTotal, setTotalCosto] = useState<Number>(0);

  const loadEgresos = async () => {
    const res = await egresoService.getEgresosTodos();
    //console.log(res.data);
    var f = new Date();
    var fecha = f.getFullYear() + "-" + f.getMonth() + 1 + "-" + f.getDate();
    //console.log(fecha);
    const mostrarCosto = res.data
      .filter(
        (egreso) =>
          moment(fecha).format("DD/MM/YYYY") ===
          moment(egreso.createdAt).format("DD/MM/YYYY")
      )
      .map((egreso) => egreso.cantidad)
      .reduce((a, b) => a + b, 0);
    setTotalCosto(mostrarCosto);
    //console.log(mostrarCosto);

    const listHoy = res.data
      .map((egreso) => {
        return {
          ...egreso,
          createdAt: egreso.createdAt ? new Date(egreso.createdAt) : new Date(),
          updatedAt: egreso.updatedAt ? new Date(egreso.updatedAt) : new Date(),
        };
      })
      .filter(
        (egreso) =>
          moment(fecha).format("DD/MM/YYYY") ===
          moment(egreso.createdAt).format("DD/MM/YYYY")
      )
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    //console.log(moment(fecha).utc().format("DD/MM/YYYY"));
    //console.log(moment(fecha).format("DD/MM/YYYY"));
    setListEgresos(listHoy);
    setLoading(false);
  };

  const loadEgresosXadmin = async (id: string) => {
    const res = await egresoService.getEgresosXAdmin(id);
    //console.log(fecha);
    const mostrarCosto = res.data
      .filter(
        (egreso) =>
          moment().format("DD/MM/YYYY") ===
          moment(egreso.createdAt).utc().format("DD/MM/YYYY")
      )
      .map((egreso) => egreso.cantidad)
      .reduce((a, b) => a + b, 0);
    setTotalCosto(mostrarCosto);
    //console.log(mostrarCosto);

    const listHoy = res.data
      .map((egreso) => {
        return {
          ...egreso,
          createdAt: egreso.createdAt ? new Date(egreso.createdAt) : new Date(),
          updatedAt: egreso.updatedAt ? new Date(egreso.updatedAt) : new Date(),
        };
      })
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .filter(
        (egreso) =>
          moment().format("DD/MM/YYYY") ===
          moment(egreso.createdAt).utc().format("DD/MM/YYYY")
      );
    setListEgresos(listHoy);
    setLoading(false);
  };

  useEffect(() => {
    if (userData.role === "Super Admin") {
      loadEgresos();
      return;
    }
    loadEgresosXadmin(userData.id);
  }, [userData.id, userData.role]);

  if (loading)
    return (
      <div className="row">
        <div className="col-md-12 my-auto">
          <div className="spinner-grow text-primary" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      </div>
    );
  return (
    <>
      <div className="card">
        <div className="card-header">
          Egresos de hoy <strong>{numberFormat(costoTotal)}</strong>
          <a
            onClick={() => history.push("/egreso/registro")}
            style={{
              textDecoration: "underline",
              float: "right",
              cursor: "pointer",
              color: "blue",
            }}
          >
            {" "}
            Nuevo Egreso
          </a>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            {listEgresos.length === 0 ? (
              <>
                No hay practicas publicadas.{" "}
                <a
                  style={{ color: "blue", cursor: "pointer" }}
                  onClick={() => history.push("/egreso/registro")}
                >
                  Registre nuevo egreso hoy
                </a>
              </>
            ) : (
              <>
                <table className="table table-bordered">
                  <thead className="table-danger">
                    <tr>
                      <th scope="col">Sede</th>
                      <th scope="col">Detalle</th>
                      <th scope="col">Costo</th>
                      <th scope="col">Fecha</th>
                      <th scope="col">Secreatari@</th>
                    </tr>
                  </thead>
                  <tbody className="table-light">
                    {listEgresos.map((egreso) => (
                      <EgresoItem key={egreso._id} egreso={egreso} />
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
export default EgresoList;
