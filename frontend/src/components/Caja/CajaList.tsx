import React, {
  useState,
  useEffect,
  useContext,
  ChangeEvent,
  useCallback,
} from "react";
import { Pagos } from "./../Pagos/Pagos";
import { Egresos } from "./../Egreso/Egresos";
import { CajaIngreso, CajaEgreso } from "./CajaItem";
import * as cajaService from "./CajaService";
import { numberFormat } from "../lib/index";
import { UserContext } from "../Context/UserContext";

import moment from "moment";
import MostarSesionTerminada from "../lib/SesionTerminada";

type InputChange = ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;
type SelectChange = ChangeEvent<HTMLSelectElement>;

const CajaList = () => {
  const { userData, setUserData }: any = useContext(UserContext);
  const [listIngresos, setListIngresos] = useState<Pagos[]>([]);
  const [listEgresos, setListEgresos] = useState<Egresos[]>([]);
  const [loading, setLoading] = useState(true);
  const [ingresoTotal, setIngresoTotal] = useState<Number>(0);
  const [egresoTotal, setEgresoTotal] = useState<Number>(0);
  const [filtro, setFiltro] = useState({
    huacho: "",
    huaral: "",
    barranca: "",
    deudores: "",
  });
  var f = new Date();
  var fechaActual =
    f.getFullYear() + "-" + (f.getMonth() + 1) + "-" + f.getDate();

  //moment(fechaActual).format("YYYY-MM-DD")
  //moment(fechaActual).format("YYYY-MM-DD")
  const [fecha, setFecha] = useState({
    ini: moment(fechaActual).format("YYYY-MM-DD"),
    fin: moment(fechaActual).format("YYYY-MM-DD"),
  });

  const loadIngresos = async () => {
    const res = await cajaService.getIngresos();
    const ingresos: any = res.data
      .map((ingreso) => ingreso.cantidad)
      .reduce((a: any, b: any) => a + b, 0);
    setIngresoTotal(ingresos);
    setListIngresos(res.data.sort((a: any, b: any) => a.confirm - b.confirm));
    setLoading(false);
  };

  const loadEgresos = async () => {
    const res = await cajaService.getEgresos();
    const egresos = res.data
      .map((egreso) => egreso.cantidad)
      .reduce((a, b) => a + b, 0);
    setEgresoTotal(egresos);
    setListEgresos(res.data);
    setLoading(false);
  };

  const handleCheckedChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFiltro({ ...filtro, [e.target.name]: e.target.checked });
  };

  const handleInputChange = async (e: InputChange) => {
    setFecha({ ...fecha, [e.target.name]: e.target.value });
  };
  const consultRangeFecha = async () => {
    const res = await cajaService.getIngresos();
    const resEgreso = await cajaService.getEgresos();
    const listRange = res.data.filter(
      (range: any) =>
        moment(range.fecha).format("YYYY-MM-DD") >= fecha.ini &&
        moment(range.fecha).format("YYYY-MM-DD") <= fecha.fin
    );
    const listRangeEgreso = resEgreso.data.filter(
      (range: any) =>
        moment(range.createdAt).format("YYYY-MM-DD") >= fecha.ini &&
        moment(range.createdAt).format("YYYY-MM-DD") <= fecha.fin
    );
    setListIngresos(listRange);
    setListEgresos(listRangeEgreso);
  };

  const loadFiltro = useCallback(async () => {
    const res = await cajaService.getIngresos();
    const resEgreso = await cajaService.getEgresos();
    if (Boolean(filtro.deudores) === true) {
      if (
        Boolean(filtro.deudores) === true &&
        Boolean(filtro.huacho) === true &&
        Boolean(filtro.huaral) === true &&
        Boolean(filtro.barranca) === true
      ) {
        setListEgresos([]);
        setEgresoTotal(0);
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
      } else if (
        Boolean(filtro.deudores) === true &&
        Boolean(filtro.barranca) === true &&
        Boolean(filtro.huacho) === true
      ) {
        setListEgresos([]);
        setEgresoTotal(0);
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
      } else if (
        Boolean(filtro.deudores) === true &&
        Boolean(filtro.huacho) === true &&
        Boolean(filtro.huaral) === true
      ) {
        setListEgresos([]);
        setEgresoTotal(0);
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
      } else if (
        Boolean(filtro.deudores) === true &&
        Boolean(filtro.barranca) === true &&
        Boolean(filtro.huacho) === true
      ) {
        setListEgresos([]);
        setEgresoTotal(0);
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
      } else if (
        Boolean(filtro.deudores) === true &&
        Boolean(filtro.barranca) === true &&
        Boolean(filtro.huaral) === true
      ) {
        setListEgresos([]);
        setEgresoTotal(0);
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
      } else if (
        Boolean(filtro.deudores) === true &&
        Boolean(filtro.barranca) === true
      ) {
        console.log(filtro.deudores);
        console.log(filtro.barranca);
        console.log(filtro.huacho);
        setListEgresos([]);
        setEgresoTotal(0);
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
      } else if (
        Boolean(filtro.deudores) === true &&
        Boolean(filtro.huaral) === true
      ) {
        setListEgresos([]);
        setEgresoTotal(0);
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
      } else if (
        Boolean(filtro.deudores) === true &&
        Boolean(filtro.huacho) === true
      ) {
        setListEgresos([]);
        setEgresoTotal(0);
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
      } else {
        setListEgresos([]);
        setEgresoTotal(0);
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
        return;
      }
    } else {
      if (
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
                ingreso.sedes.name === "Barranca")
            : //ingreso.sedes.name === "Barranca"
              ingreso.sedes.name === "Huacho" ||
              ingreso.sedes.name === "Huaral" ||
              ingreso.sedes.name === "Barranca"
        );

        setListIngresos(
          ingresos.sort((a: any, b: any) => a.confirm - b.confirm)
        );

        const cantidad = ingresos
          .map((ingreso: any) =>
            ingreso.stateRenta ? ingreso.acuenta : ingreso.tramites.costo
          )
          .reduce((a: any, b: any) => a + b, 0);

        setIngresoTotal(cantidad);

        const egresos: any = resEgreso.data.filter((egreso: any) =>
          fecha.ini && fecha.fin
            ? moment(egreso.createdAt).format("YYYY-MM-DD") >= fecha.ini &&
              moment(egreso.createdAt).format("YYYY-MM-DD") <= fecha.fin &&
              (egreso.sedes.name === "Huacho" ||
                egreso.sedes.name === "Huaral" ||
                egreso.sedes.name === "Barranca")
            : egreso.sedes.name === "Huacho" ||
              egreso.sedes.name === "Huaral" ||
              egreso.sedes.name === "Barranca"
        );

        setListEgresos(egresos);

        const cantidadEgreso = egresos
          .map((egreso: any) => egreso.cantidad)
          .reduce((a: any, b: any) => a + b, 0);
        setEgresoTotal(cantidadEgreso);
      } else if (
        Boolean(filtro.huacho) === true &&
        Boolean(filtro.barranca) === true &&
        Boolean(filtro.huaral) === true
      ) {
        console.log("huacho huaral barrancax2");
        const ingresos: any = res.data.filter((ingreso: any) =>
          fecha.ini && fecha.fin
            ? moment(ingreso.createdAt).format("YYYY-MM-DD") >= fecha.ini &&
              moment(ingreso.createdAt).format("YYYY-MM-DD") <= fecha.fin &&
              (ingreso.sedes.name === "Huacho" ||
                ingreso.sedes.name === "Barranca" ||
                ingreso.sedes.name === "Huaral")
            : ingreso.sedes.name === "Huacho" ||
              ingreso.sedes.name === "Barranca" ||
              ingreso.sedes.name === "Huaral"
        );
        setListIngresos(
          ingresos.sort((a: any, b: any) => a.confirm - b.confirm)
        );

        const cantidad = ingresos
          .map((ingreso: any) =>
            ingreso.stateRenta ? ingreso.acuenta : ingreso.tramites.costo
          )
          .reduce((a: any, b: any) => a + b, 0);
        setIngresoTotal(cantidad);

        const egresos: any = resEgreso.data.filter((egreso: any) =>
          fecha.ini && fecha.fin
            ? moment(egreso.createdAt).format("YYYY-MM-DD") >= fecha.ini &&
              moment(egreso.createdAt).format("YYYY-MM-DD") <= fecha.fin &&
              (egreso.sedes.name === "Huacho" ||
                egreso.sedes.name === "Barranca" ||
                egreso.sedes.name === "Huaral")
            : egreso.sedes.name === "Huacho" ||
              egreso.sedes.name === "Barranca" ||
              egreso.sedes.name === "Huaral"
        );

        setListEgresos(egresos);

        const cantidadEgreso = egresos
          .map((egreso: any) => egreso.cantidad)
          .reduce((a: any, b: any) => a + b, 0);
        setEgresoTotal(cantidadEgreso);
      } else if (
        Boolean(filtro.huaral) === true &&
        Boolean(filtro.huacho) === true &&
        Boolean(filtro.barranca) === true
      ) {
        const ingresos: any = res.data.filter((ingreso: any) =>
          fecha.ini && fecha.fin
            ? moment(ingreso.createdAt).format("YYYY-MM-DD") >= fecha.ini &&
              moment(ingreso.createdAt).format("YYYY-MM-DD") <= fecha.fin &&
              (ingreso.sedes.name === "Huaral" ||
                ingreso.sedes.name === "Huacho" ||
                ingreso.sedes.name === "Barranca")
            : ingreso.sedes.name === "Huaral" ||
              ingreso.sedes.name === "Huacho" ||
              ingreso.sedes.name === "Barranca"
        );
        setListIngresos(
          ingresos.sort((a: any, b: any) => a.confirm - b.confirm)
        );

        const cantidad = ingresos
          .map((ingreso: any) =>
            ingreso.stateRenta ? ingreso.acuenta : ingreso.tramites.costo
          )
          .reduce((a: any, b: any) => a + b, 0);
        setIngresoTotal(cantidad);

        const egresos: any = resEgreso.data.filter((egreso: any) =>
          fecha.ini && fecha.fin
            ? moment(egreso.createdAt).format("YYYY-MM-DD") >= fecha.ini &&
              moment(egreso.createdAt).format("YYYY-MM-DD") <= fecha.fin &&
              (egreso.sedes.name === "Huaral" ||
                egreso.sedes.name === "Huacho" ||
                egreso.sedes.name === "Barranca")
            : egreso.sedes.name === "Huaral" ||
              egreso.sedes.name === "Huacho" ||
              egreso.sedes.name === "Barranca"
        );

        setListEgresos(egresos);

        const cantidadEgreso = egresos
          .map((egreso: any) => egreso.cantidad)
          .reduce((a: any, b: any) => a + b, 0);
        setEgresoTotal(cantidadEgreso);
      } else if (
        Boolean(filtro.huaral) === true &&
        Boolean(filtro.barranca) === true &&
        Boolean(filtro.huacho) === true
      ) {
        const ingresos: any = res.data.filter((ingreso: any) =>
          fecha.ini && fecha.fin
            ? moment(ingreso.createdAt).format("YYYY-MM-DD") >= fecha.ini &&
              moment(ingreso.createdAt).format("YYYY-MM-DD") <= fecha.fin &&
              (ingreso.sedes.name === "Huaral" ||
                ingreso.sedes.name === "Barranca" ||
                ingreso.sedes.name === "Huacho")
            : ingreso.sedes.name === "Huaral" ||
              ingreso.sedes.name === "Barranca" ||
              ingreso.sedes.name === "Huacho"
        );
        setListIngresos(
          ingresos.sort((a: any, b: any) => a.confirm - b.confirm)
        );

        const cantidad = ingresos
          .map((ingreso: any) =>
            ingreso.stateRenta ? ingreso.acuenta : ingreso.tramites.costo
          )
          .reduce((a: any, b: any) => a + b, 0);
        setIngresoTotal(cantidad);

        const egresos: any = resEgreso.data.filter((egreso: any) =>
          fecha.ini && fecha.fin
            ? moment(egreso.createdAt).format("YYYY-MM-DD") >= fecha.ini &&
              moment(egreso.createdAt).format("YYYY-MM-DD") <= fecha.fin &&
              (egreso.sedes.name === "Huaral" ||
                egreso.sedes.name === "Barranca" ||
                egreso.sedes.name === "Huacho")
            : egreso.sedes.name === "Huaral" ||
              egreso.sedes.name === "Barranca" ||
              egreso.sedes.name === "Huacho"
        );

        setListEgresos(egresos);

        const cantidadEgreso = egresos
          .map((egreso: any) => egreso.cantidad)
          .reduce((a: any, b: any) => a + b, 0);
        setEgresoTotal(cantidadEgreso);
      } else if (
        Boolean(filtro.barranca) === true &&
        Boolean(filtro.huaral) === true &&
        Boolean(filtro.huacho) === true
      ) {
        const ingresos: any = res.data.filter((ingreso: any) =>
          fecha.ini && fecha.fin
            ? moment(ingreso.createdAt).format("YYYY-MM-DD") >= fecha.ini &&
              moment(ingreso.createdAt).format("YYYY-MM-DD") <= fecha.fin &&
              (ingreso.sedes.name === "Barranca" ||
                ingreso.sedes.name === "Huaral" ||
                ingreso.sedes.name === "Huacho")
            : ingreso.sedes.name === "Barranca" ||
              ingreso.sedes.name === "Huaral" ||
              ingreso.sedes.name === "Huacho"
        );
        setListIngresos(
          ingresos.sort((a: any, b: any) => a.confirm - b.confirm)
        );

        const cantidad = ingresos
          .map((ingreso: any) =>
            ingreso.stateRenta ? ingreso.acuenta : ingreso.tramites.costo
          )
          .reduce((a: any, b: any) => a + b, 0);
        setIngresoTotal(cantidad);

        const egresos: any = resEgreso.data.filter((egreso: any) =>
          fecha.ini && fecha.fin
            ? moment(egreso.createdAt).format("YYYY-MM-DD") >= fecha.ini &&
              moment(egreso.createdAt).format("YYYY-MM-DD") <= fecha.fin &&
              (egreso.sedes.name === "Barranca" ||
                egreso.sedes.name === "Huaral" ||
                egreso.sedes.name === "Huacho")
            : egreso.sedes.name === "Barranca" ||
              egreso.sedes.name === "Huaral" ||
              egreso.sedes.name === "Huacho"
        );

        setListEgresos(egresos);

        const cantidadEgreso = egresos
          .map((egreso: any) => egreso.cantidad)
          .reduce((a: any, b: any) => a + b, 0);
        setEgresoTotal(cantidadEgreso);
      } else if (
        Boolean(filtro.barranca) === true &&
        Boolean(filtro.huacho) === true &&
        Boolean(filtro.huaral) === true
      ) {
        const ingresos: any = res.data.filter((ingreso: any) =>
          fecha.ini && fecha.fin
            ? moment(ingreso.createdAt).format("YYYY-MM-DD") >= fecha.ini &&
              moment(ingreso.createdAt).format("YYYY-MM-DD") <= fecha.fin &&
              (ingreso.sedes.name === "Barranca" ||
                ingreso.sedes.name === "Huacho" ||
                ingreso.sedes.name === "Huaral")
            : ingreso.sedes.name === "Barranca" ||
              ingreso.sedes.name === "Huacho" ||
              ingreso.sedes.name === "Huaral"
        );
        setListIngresos(
          ingresos.sort((a: any, b: any) => a.confirm - b.confirm)
        );

        const cantidad = ingresos
          .map((ingreso: any) =>
            ingreso.stateRenta ? ingreso.acuenta : ingreso.tramites.costo
          )
          .reduce((a: any, b: any) => a + b, 0);
        setIngresoTotal(cantidad);

        const egresos: any = resEgreso.data.filter((egreso: any) =>
          fecha.ini && fecha.fin
            ? moment(egreso.createdAt).format("YYYY-MM-DD") >= fecha.ini &&
              moment(egreso.createdAt).format("YYYY-MM-DD") <= fecha.fin &&
              (egreso.sedes.name === "Barranca" ||
                egreso.sedes.name === "Huacho" ||
                egreso.sedes.name === "Huaral")
            : egreso.sedes.name === "Barranca" ||
              egreso.sedes.name === "Huacho" ||
              egreso.sedes.name === "Huaral"
        );

        setListEgresos(egresos);

        const cantidadEgreso = egresos
          .map((egreso: any) => egreso.cantidad)
          .reduce((a: any, b: any) => a + b, 0);
        setEgresoTotal(cantidadEgreso);
      } else if (
        Boolean(filtro.huacho) === true &&
        Boolean(filtro.huaral) === true
      ) {
        const ingresos: any = res.data.filter((ingreso: any) =>
          fecha.ini && fecha.fin
            ? moment(ingreso.createdAt).format("YYYY-MM-DD") >= fecha.ini &&
              moment(ingreso.createdAt).format("YYYY-MM-DD") <= fecha.fin &&
              (ingreso.sedes.name === "Huacho" ||
                ingreso.sedes.name === "Huaral")
            : ingreso.sedes.name === "Huacho" || ingreso.sedes.name === "Huaral"
        );
        setListIngresos(
          ingresos.sort((a: any, b: any) => a.confirm - b.confirm)
        );

        const cantidad = ingresos
          .map((ingreso: any) =>
            ingreso.stateRenta ? ingreso.acuenta : ingreso.tramites.costo
          )
          .reduce((a: any, b: any) => a + b, 0);
        setIngresoTotal(cantidad);

        const egresos: any = resEgreso.data.filter((egreso: any) =>
          fecha.ini && fecha.fin
            ? moment(egreso.createdAt).format("YYYY-MM-DD") >= fecha.ini &&
              moment(egreso.createdAt).format("YYYY-MM-DD") <= fecha.fin &&
              (egreso.sedes.name === "Huacho" || egreso.sedes.name === "Huaral")
            : egreso.sedes.name === "Huacho" || egreso.sedes.name === "Huaral"
        );

        setListEgresos(egresos);

        const cantidadEgreso = egresos
          .map((egreso: any) => egreso.cantidad)
          .reduce((a: any, b: any) => a + b, 0);
        setEgresoTotal(cantidadEgreso);
      } else if (
        Boolean(filtro.huacho) === true &&
        Boolean(filtro.barranca) === true
      ) {
        const ingresos: any = res.data.filter((ingreso: any) =>
          fecha.ini && fecha.fin
            ? moment(ingreso.createdAt).format("YYYY-MM-DD") >= fecha.ini &&
              moment(ingreso.createdAt).format("YYYY-MM-DD") <= fecha.fin &&
              (ingreso.sedes.name === "Huacho" ||
                ingreso.sedes.name === "Barranca")
            : ingreso.sedes.name === "Huacho" ||
              ingreso.sedes.name === "Barranca"
        );
        setListIngresos(
          ingresos.sort((a: any, b: any) => a.confirm - b.confirm)
        );

        const cantidad = ingresos
          .map((ingreso: any) =>
            ingreso.stateRenta ? ingreso.acuenta : ingreso.tramites.costo
          )
          .reduce((a: any, b: any) => a + b, 0);
        setIngresoTotal(cantidad);

        const egresos: any = resEgreso.data.filter((egreso: any) =>
          fecha.ini && fecha.fin
            ? moment(egreso.createdAt).format("YYYY-MM-DD") >= fecha.ini &&
              moment(egreso.createdAt).format("YYYY-MM-DD") <= fecha.fin &&
              (egreso.sedes.name === "Huacho" ||
                egreso.sedes.name === "Barranca")
            : egreso.sedes.name === "Huacho" || egreso.sedes.name === "Barranca"
        );

        setListEgresos(egresos);

        const cantidadEgreso = egresos
          .map((egreso: any) => egreso.cantidad)
          .reduce((a: any, b: any) => a + b, 0);
        setEgresoTotal(cantidadEgreso);
      } else if (
        Boolean(filtro.huaral) === true &&
        Boolean(filtro.huacho) === true
      ) {
        const ingresos: any = res.data.filter((ingreso: any) =>
          fecha.ini && fecha.fin
            ? moment(ingreso.createdAt).format("YYYY-MM-DD") >= fecha.ini &&
              moment(ingreso.createdAt).format("YYYY-MM-DD") <= fecha.fin &&
              (ingreso.sedes.name === "Huaral" ||
                ingreso.sedes.name === "Huacho")
            : ingreso.sedes.name === "Huaral" || ingreso.sedes.name === "Huacho"
        );
        setListIngresos(
          ingresos.sort((a: any, b: any) => a.confirm - b.confirm)
        );

        const cantidad = ingresos
          .map((ingreso: any) =>
            ingreso.stateRenta ? ingreso.acuenta : ingreso.tramites.costo
          )
          .reduce((a: any, b: any) => a + b, 0);
        setIngresoTotal(cantidad);

        const egresos: any = resEgreso.data.filter((egreso: any) =>
          fecha.ini && fecha.fin
            ? moment(egreso.createdAt).format("YYYY-MM-DD") >= fecha.ini &&
              moment(egreso.createdAt).format("YYYY-MM-DD") <= fecha.fin &&
              (egreso.sedes.name === "Huaral" || egreso.sedes.name === "Huacho")
            : egreso.sedes.name === "Huaral" || egreso.sedes.name === "Huacho"
        );

        setListEgresos(egresos);

        const cantidadEgreso = egresos
          .map((egreso: any) => egreso.cantidad)
          .reduce((a: any, b: any) => a + b, 0);
        setEgresoTotal(cantidadEgreso);
      } else if (
        Boolean(filtro.huaral) === true &&
        Boolean(filtro.barranca) === true
      ) {
        const ingresos: any = res.data.filter((ingreso: any) =>
          fecha.ini && fecha.fin
            ? moment(ingreso.createdAt).format("YYYY-MM-DD") >= fecha.ini &&
              moment(ingreso.createdAt).format("YYYY-MM-DD") <= fecha.fin &&
              (ingreso.sedes.name === "Huaral" ||
                ingreso.sedes.name === "Barranca")
            : ingreso.sedes.name === "Huaral" ||
              ingreso.sedes.name === "Barranca"
        );
        setListIngresos(
          ingresos.sort((a: any, b: any) => a.confirm - b.confirm)
        );

        const cantidad = ingresos
          .map((ingreso: any) =>
            ingreso.stateRenta ? ingreso.acuenta : ingreso.tramites.costo
          )
          .reduce((a: any, b: any) => a + b, 0);
        setIngresoTotal(cantidad);

        const egresos: any = resEgreso.data.filter((egreso: any) =>
          fecha.ini && fecha.fin
            ? moment(egreso.createdAt).format("YYYY-MM-DD") >= fecha.ini &&
              moment(egreso.createdAt).format("YYYY-MM-DD") <= fecha.fin &&
              (egreso.sedes.name === "Huaral" ||
                egreso.sedes.name === "Barranca")
            : egreso.sedes.name === "Huaral" || egreso.sedes.name === "Barranca"
        );

        setListEgresos(egresos);

        const cantidadEgreso = egresos
          .map((egreso: any) => egreso.cantidad)
          .reduce((a: any, b: any) => a + b, 0);
        setEgresoTotal(cantidadEgreso);
      } else if (
        Boolean(filtro.barranca) === true &&
        Boolean(filtro.huacho) === true
      ) {
        const ingresos: any = res.data.filter((ingreso: any) =>
          fecha.ini && fecha.fin
            ? moment(ingreso.createdAt).format("YYYY-MM-DD") >= fecha.ini &&
              moment(ingreso.createdAt).format("YYYY-MM-DD") <= fecha.fin &&
              (ingreso.sedes.name === "Barranca" ||
                ingreso.sedes.name === "Huacho")
            : ingreso.sedes.name === "Barranca" ||
              ingreso.sedes.name === "Huacho"
        );
        setListIngresos(
          ingresos.sort((a: any, b: any) => a.confirm - b.confirm)
        );

        const cantidad = ingresos
          .map((ingreso: any) =>
            ingreso.stateRenta ? ingreso.acuenta : ingreso.tramites.costo
          )
          .reduce((a: any, b: any) => a + b, 0);
        setIngresoTotal(cantidad);

        const egresos: any = resEgreso.data.filter((egreso: any) =>
          fecha.ini && fecha.fin
            ? moment(egreso.createdAt).format("YYYY-MM-DD") >= fecha.ini &&
              moment(egreso.createdAt).format("YYYY-MM-DD") <= fecha.fin &&
              (egreso.sedes.name === "Barranca" ||
                egreso.sedes.name === "Huacho")
            : egreso.sedes.name === "Barranca" || egreso.sedes.name === "Huacho"
        );

        setListEgresos(egresos);

        const cantidadEgreso = egresos
          .map((egreso: any) => egreso.cantidad)
          .reduce((a: any, b: any) => a + b, 0);
        setEgresoTotal(cantidadEgreso);
      } else if (
        Boolean(filtro.barranca) === true &&
        Boolean(filtro.huaral) === true
      ) {
        const ingresos: any = res.data.filter((ingreso: any) =>
          fecha.ini && fecha.fin
            ? moment(ingreso.createdAt).format("YYYY-MM-DD") >= fecha.ini &&
              moment(ingreso.createdAt).format("YYYY-MM-DD") <= fecha.fin &&
              (ingreso.sedes.name === "Barranca" ||
                ingreso.sedes.name === "Huaral")
            : ingreso.sedes.name === "Barranca" ||
              ingreso.sedes.name === "Huaral"
        );
        setListIngresos(
          ingresos.sort((a: any, b: any) => a.confirm - b.confirm)
        );

        const cantidad = ingresos
          .map((ingreso: any) =>
            ingreso.stateRenta ? ingreso.acuenta : ingreso.tramites.costo
          )
          .reduce((a: any, b: any) => a + b, 0);
        setIngresoTotal(cantidad);

        const egresos: any = resEgreso.data.filter((egreso: any) =>
          fecha.ini && fecha.fin
            ? moment(egreso.createdAt).format("YYYY-MM-DD") >= fecha.ini &&
              moment(egreso.createdAt).format("YYYY-MM-DD") <= fecha.fin &&
              (egreso.sedes.name === "Barranca" ||
                egreso.sedes.name === "Huaral")
            : egreso.sedes.name === "Barranca" || egreso.sedes.name === "Huaral"
        );

        setListEgresos(egresos);

        const cantidadEgreso = egresos
          .map((egreso: any) => egreso.cantidad)
          .reduce((a: any, b: any) => a + b, 0);
        setEgresoTotal(cantidadEgreso);
      } else if (Boolean(filtro.huacho) === true) {
        const ingresos: any = res.data.filter((ingreso: any) =>
          fecha.ini && fecha.fin
            ? moment(ingreso.createdAt).format("YYYY-MM-DD") >= fecha.ini &&
              moment(ingreso.createdAt).format("YYYY-MM-DD") <= fecha.fin &&
              ingreso.sedes.name === "Huacho"
            : ingreso.sedes.name === "Huacho"
        );
        setListIngresos(
          ingresos.sort((a: any, b: any) => a.confirm - b.confirm)
        );

        const cantidad = ingresos
          .map((ingreso: any) =>
            ingreso.stateRenta ? ingreso.acuenta : ingreso.tramites.costo
          )
          .reduce((a: any, b: any) => a + b, 0);
        setIngresoTotal(cantidad);

        const egresos: any = resEgreso.data.filter((egreso: any) =>
          fecha.ini && fecha.fin
            ? moment(egreso.createdAt).format("YYYY-MM-DD") >= fecha.ini &&
              moment(egreso.createdAt).format("YYYY-MM-DD") <= fecha.fin &&
              egreso.sedes.name === "Huacho"
            : egreso.sedes.name === "Huacho"
        );

        setListEgresos(egresos);

        const cantidadEgreso = egresos
          .map((egreso: any) => egreso.cantidad)
          .reduce((a: any, b: any) => a + b, 0);
        setEgresoTotal(cantidadEgreso);
      } else if (Boolean(filtro.huaral) === true) {
        const ingresos: any = res.data.filter((ingreso: any) =>
          fecha.ini && fecha.fin
            ? moment(ingreso.createdAt).format("YYYY-MM-DD") >= fecha.ini &&
              moment(ingreso.createdAt).format("YYYY-MM-DD") <= fecha.fin &&
              ingreso.sedes.name === "Huaral"
            : ingreso.sedes.name === "Huaral"
        );

        setListIngresos(
          ingresos.sort((a: any, b: any) => a.confirm - b.confirm)
        );

        const cantidad = ingresos
          .map((ingreso: any) =>
            ingreso.stateRenta ? ingreso.acuenta : ingreso.tramites.costo
          )
          .reduce((a: any, b: any) => a + b, 0);
        setIngresoTotal(cantidad);

        const egresos: any = resEgreso.data.filter((egreso: any) =>
          fecha.ini && fecha.fin
            ? moment(egreso.createdAt).format("YYYY-MM-DD") >= fecha.ini &&
              moment(egreso.createdAt).format("YYYY-MM-DD") <= fecha.fin &&
              egreso.sedes.name === "Huaral"
            : egreso.sedes.name === "Huaral"
        );

        setListEgresos(egresos);

        const cantidadEgreso = egresos
          .map((egreso: any) => egreso.cantidad)
          .reduce((a: any, b: any) => a + b, 0);
        setEgresoTotal(cantidadEgreso);
      } else if (Boolean(filtro.barranca) === true) {
        const ingresos: any = res.data.filter((ingreso: any) =>
          fecha.ini && fecha.fin
            ? moment(ingreso.createdAt).format("YYYY-MM-DD") >= fecha.ini &&
              moment(ingreso.createdAt).format("YYYY-MM-DD") <= fecha.fin &&
              ingreso.sedes.name === "Barranca"
            : ingreso.sedes.name === "Barranca"
        );
        setListIngresos(
          ingresos.sort((a: any, b: any) => a.confirm - b.confirm)
        );

        const cantidad = ingresos
          .map((ingreso: any) =>
            ingreso.stateRenta ? ingreso.acuenta : ingreso.tramites.costo
          )
          .reduce((a: any, b: any) => a + b, 0);
        setIngresoTotal(cantidad);

        const egresos: any = resEgreso.data.filter((egreso: any) =>
          fecha.ini && fecha.fin
            ? moment(egreso.createdAt).format("YYYY-MM-DD") >= fecha.ini &&
              moment(egreso.createdAt).format("YYYY-MM-DD") <= fecha.fin &&
              egreso.sedes.name === "Barranca"
            : egreso.sedes.name === "Barranca"
        );

        setListEgresos(egresos);

        const cantidadEgreso = egresos
          .map((egreso: any) => egreso.cantidad)
          .reduce((a: any, b: any) => a + b, 0);
        setEgresoTotal(cantidadEgreso);
      } else {
        const ingresos: any = res.data.filter(
          (ingreso: any) =>
            moment(ingreso.createdAt).format("YYYY-MM-DD") >= fecha.ini &&
            moment(ingreso.createdAt).format("YYYY-MM-DD") <= fecha.fin
        );
        //console.log(ingresos.sort((a: any, b: any) => a.confirm - b.confirm));
        setListIngresos(
          ingresos.sort((a: any, b: any) => a.confirm - b.confirm)
        );

        const cantidad = ingresos
          .map((ingreso: any) =>
            ingreso.stateRenta ? ingreso.acuenta : ingreso.tramites.costo
          )
          .reduce((a: any, b: any) => a + b, 0);
        setIngresoTotal(cantidad);

        const egresos: any = resEgreso.data.filter(
          (egreso: any) =>
            moment(egreso.createdAt).format("YYYY-MM-DD") >= fecha.ini &&
            moment(egreso.createdAt).format("YYYY-MM-DD") <= fecha.fin
        );

        setListEgresos(egresos);

        const cantidadEgreso = egresos
          .map((egreso: any) => egreso.cantidad)
          .reduce((a: any, b: any) => a + b, 0);
        setEgresoTotal(cantidadEgreso);
      }
    }
  }, [
    filtro.huacho,
    filtro.huaral,
    filtro.barranca,
    fecha.ini,
    fecha.fin,
    filtro.deudores,
  ]);
  useEffect(() => {
    //loadIngresos();
    loadEgresos();

    //consultRangeFecha();
    loadFiltro();
  }, [loadFiltro]);

  return (
    <>
      <div className="card">
        <div className="card-header">
          {Boolean(filtro.deudores) === true ? <>Deben </> : <>Caja </>}
          <strong style={{ color: "green" }}>
            {numberFormat(ingresoTotal)}
          </strong>{" "}
          {Boolean(filtro.deudores) === true ? (
            <></>
          ) : (
            <>
              -{" "}
              <strong style={{ color: "red" }}>
                {numberFormat(egresoTotal)}
              </strong>{" "}
              {" = "}
              <strong style={{ color: "purple" }}>
                {numberFormat(Number(ingresoTotal) - Number(egresoTotal))}
              </strong>
            </>
          )}
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
                <strong>{listIngresos.length}</strong> ingresos
              </span>
            </div>
            {filtro.deudores ? (
              ""
            ) : (
              <div className="col-sm-2">
                <strong>{listEgresos.length}</strong> egresos
              </div>
            )}
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
                    value={filtro.huacho}
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
                    value={filtro.huaral}
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
                    value={filtro.barranca}
                  />
                  Barranca
                </label>
              </div>
            </div>
            <div className="form-group col-sm-2">
              <div className="form-check">
                <label className="form-check-label">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="deudores"
                    onChange={handleCheckedChange}
                    value={filtro.deudores}
                  />
                  Calcular monto deudores
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
                                debe={Boolean(filtro.deudores)}
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
                    {listEgresos.length === 0 ? (
                      <>
                        <strong>No hay egresos</strong>
                        <br />
                        <br />
                      </>
                    ) : (
                      <>
                        <table className="table table-bordered">
                          <thead className="table-danger">
                            <tr>
                              <th scope="col">Sede</th>
                              <th scope="col">Detalle</th>
                              <th scope="col">Monto</th>
                              <th scope="col">Secretari@</th>
                              <th scope="col">Fecha</th>
                            </tr>
                          </thead>
                          <tbody className="table-light">
                            {listEgresos.map((egreso) => (
                              <CajaEgreso key={egreso._id} egreso={egreso} />
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

export default CajaList;
