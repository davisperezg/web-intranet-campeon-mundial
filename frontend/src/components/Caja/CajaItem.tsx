import React, { useState } from "react";
import { Pagos } from "./../Pagos/Pagos";
import { Egresos } from "./../Egreso/Egresos";
import moment from "moment";
import { numberFormat } from "../lib/index";
import { AiFillCaretUp, AiFillCaretDown, AiOutlineCheck } from "react-icons/ai";
import { WiStormWarning } from "react-icons/wi";
import * as pagoService from "../Pagos/PagosService";
import { FaExchangeAlt } from "react-icons/fa";

interface PropsIngreso {
  pago: Pagos;
  loadIngresos: () => void;
}
interface PropsEgreso {
  egreso: Egresos;
}

//<span className="badge badge-success">Success</span>
export const CajaIngreso = (props: PropsIngreso) => {
  const { pago, loadIngresos }: any = props;

  const handleEstadoWarning = async (id: string) => {
    const data: any = {
      confirm: 2,
    };
    await pagoService.updateEstado(id, data);
    loadIngresos();
  };
  const handleEstadoCheck = async (id: string) => {
    const data: any = {
      confirm: 1,
    };
    await pagoService.updateEstado(id, data);
    loadIngresos();
  };
  const handleEstadoNull = async (id: string) => {
    const data: any = {
      confirm: 0,
    };
    await pagoService.updateEstado(id, data);
    loadIngresos();
  };
  return (
    <>
      <tr key={pago._id}>
        <td>{pago.sedes.name}</td>
        <td style={{ textAlign: "center" }}>{pago.estudiante.nro}</td>
        <td>{pago.estudiante.nombres}</td>
        <td>{pago.registrador.nombres}</td>
        <td style={{ textAlign: "center" }}>{pago.nroRecibo}</td>
        <td>
          <span style={{ color: "green" }}>{numberFormat(pago.cantidad)}</span>{" "}
          <AiFillCaretUp style={{ color: "green", float: "right" }} />{" "}
        </td>
        <td>{pago.tramites.name}</td>
        <td>{moment(pago.createdAt).format("DD/MM/YYYY")}</td>
        <td>
          {pago.confirm === 1 ? (
            <>
              <span className="badge badge-success">Aceptado</span>
              <FaExchangeAlt
                onClick={() => pago._id && handleEstadoNull(pago._id)}
                style={{ float: "right", cursor: "pointer" }}
              />
            </>
          ) : (
            <>
              {pago.confirm === 0 ? (
                <>
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
              ) : (
                <>
                  <span className="badge badge-warning">Observación</span>
                  <FaExchangeAlt
                    onClick={() => pago._id && handleEstadoNull(pago._id)}
                    style={{ float: "right", cursor: "pointer" }}
                  />
                </>
              )}
            </>
          )}
        </td>
      </tr>
    </>
  );
};

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
