import React, { useState, useContext } from "react";
import { Pagos } from "./../Pagos/Pagos";
import { Egresos } from "./../Egreso/Egresos";
import moment from "moment";
import { numberFormat } from "../lib/index";
import { AiFillCaretUp, AiFillCaretDown, AiOutlineCheck } from "react-icons/ai";
import { WiStormWarning } from "react-icons/wi";
import * as pagoService from "../Pagos/PagosService";
import { FaExchangeAlt } from "react-icons/fa";
import { PagoContext, PagoProvider } from "../Context/PagoContext";
import { GoPencil } from "react-icons/go";
import { useHistory } from "react-router-dom";

interface PropsIngreso {
  debe: Boolean;
  pago: Pagos;
  loadIngresos: () => void;
  alumnoList?: Boolean;
}
interface PropsEgreso {
  egreso: Egresos;
}

//<span className="badge badge-success">Success</span>
export const CajaIngreso = (props: PropsIngreso) => {
  const { pago, loadIngresos, debe, alumnoList }: any = props;
  const history = useHistory();
  return (
    <>
      <tr key={pago._id}>
        <td>{pago.sedes.name}</td>
        <td style={{ textAlign: "center" }}>{pago.estudiante.nro}</td>
        <td>{pago.estudiante.nombres}</td>
        {alumnoList ? (
          <>
            <td>
              {pago.estudiante.cellphone}{" "}
              {pago.estudiante.telephone ? (
                <>- {pago.estudiante.telephone}</>
              ) : (
                ""
              )}
            </td>
          </>
        ) : (
          ""
        )}
        <td>{pago.registrador.nombres}</td>
        <td>{pago.tramites.name}</td>
        <td style={{ textAlign: "center" }}>{pago.nroRecibo}</td>
        {debe ? (
          <>
            <td>
              <span style={{ color: "black" }}>
                {pago.stateRenta
                  ? numberFormat(pago.acuenta)
                  : numberFormat(pago.tramites.costo)}
              </span>{" "}
            </td>
            <td>
              <span style={{ color: "green" }}>
                {pago.stateRenta
                  ? numberFormat(
                      pago.tramites.costo * pago.cantidad - pago.acuenta
                    )
                  : "NO DEBE"}
              </span>
              <AiFillCaretUp style={{ color: "green", float: "right" }} />{" "}
            </td>
          </>
        ) : (
          <>
            <td>
              <span style={{ color: "green" }}>
                {pago.stateRenta
                  ? numberFormat(pago.acuenta)
                  : numberFormat(pago.tramites.costo)}
              </span>{" "}
              <AiFillCaretUp style={{ color: "green", float: "right" }} />{" "}
            </td>
            <td>
              <span style={{ color: "black" }}>
                {pago.stateRenta
                  ? numberFormat(
                      pago.tramites.costo * pago.cantidad - pago.acuenta
                    )
                  : "NO DEBE"}
              </span>
            </td>
          </>
        )}

        <td>{moment(pago.createdAt).format("DD/MM/YYYY")}</td>
        <td style={{ textAlign: "center" }}>
          {pago.confirm === 1 ? (
            <>
              <span className="badge badge-success">Pagado</span>
            </>
          ) : (
            <>
              {alumnoList ? (
                <>
                  <span className="badge badge-danger">Debe</span>
                  <GoPencil
                    onClick={() => {
                      history.push(
                        `/alumnos/pagos/${pago.estudiante._id}/pago/${pago._id}`
                      );
                    }}
                    style={{
                      cursor: "pointer",
                      fontSize: "17px",
                      marginLeft: "5px",
                    }}
                  />
                </>
              ) : (
                <>
                  <span className="badge badge-danger">Debe</span>
                </>
              )}
            </>
          )}
        </td>
      </tr>
    </>
  );
};
/**
                    <>
                                  <FaExchangeAlt
                onClick={() => pago._id && handleEstadoNull(pago._id)}
                style={{ float: "right", cursor: "pointer" }}
              />
                  <WiStormWarning
                    onClick={() => pago._id && handleEstadoWarning(pago._id)}
                    style={{
                      color: "red",
                      cursor: "pointer",
                      fontSize: "larger",
                    }}
                  />
                  <AiOutlineCheck
                    onClick={() => pago._id && handleEstadoCheck(pago._id)}
                    style={{
                      color: "green",
                      cursor: "pointer",
                      fontSize: "larger",
                    }}
                  />
                </>
 */
export const CajaEgreso = (props: PropsEgreso) => {
  const { egreso }: any = props;
  return (
    <>
      <tr key={egreso._id}>
        <td>{egreso.sedes.name}</td>
        <td>{egreso.detalle}</td>
        <td>
          <span style={{ color: "red" }}>{numberFormat(egreso.cantidad)}</span>{" "}
          <AiFillCaretDown style={{ color: "red", float: "right" }} />
        </td>

        <td>{egreso.registrador[0].nombres}</td>
        <td>{moment(egreso.createdAt).format("DD/MM/YYYY")}</td>
      </tr>
    </>
  );
};
