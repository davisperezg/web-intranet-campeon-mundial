import { Response, RequestHandler } from "express";
import Pagos from "../models/Pagos";
import Tramite from "../models/Tramite";
import Users from "../models/Users";

export const createPago: RequestHandler = async (req, res) => {
  try {
    const { registrador, estudiante, cantidad, nroRecibo, fecha } = req.body;
    //console.log(cantidad);
    const ultimaFicha: any = await Users.findOne({ _id: estudiante })
      .sort({ $natural: -1 })
      .limit(1)
      //.populate("tramites", "name")
      .populate("tramites", "name costo")
      .populate("sedes", "name");
    //console.log(ultimaFicha);

    //console.log(ultimaFicha.tramites[0].costo);
    console.log(ultimaFicha.sedes[0]._id);
    console.log(ultimaFicha.sedes[0].name);
    if (!cantidad) {
      return res.status(400).json({ message: "Ingrese la cantidad" });
    }

    if (cantidad > Number(ultimaFicha.tramites[0].costo)) {
      return res.status(400).json({
        message:
          "El tramite de este alumno es " +
          ultimaFicha.tramites[0].name +
          " con un costo de S/ " +
          ultimaFicha.tramites[0].costo +
          ", no puede superar la cantidad al costo del tramite",
      });
    }
    if (!nroRecibo) {
      return res.status(400).json({ message: "Ingrese el nro de recibo" });
    }
    if (!registrador) {
      return res
        .status(404)
        .json({ message: "No puede registrar pago sin un registrador" });
    }
    if (!estudiante) {
      return res
        .status(400)
        .json({ message: "No puede registrar pago sin un estudiante" });
    }
    req.body.estado = 1;

    const newPago = new Pagos({
      registrador,
      estudiante,
      cantidad,
      nroRecibo,
      //fecha,
      tramites: ultimaFicha.tramites[0]._id,
      estado: 1,
      sedes: ultimaFicha.sedes[0]._id,
    });
    const savedPago = await newPago.save();
    res.status(200).json(savedPago);
  } catch (e) {
    console.log(e);
    res.status(400).json(e);
  }
};

export const getPagos: RequestHandler = async (req, res) => {
  try {
    const pagos = await Pagos.find({
      estudiante: { $in: req.params.id },
      estado: { $in: 1 },
    })
      .populate("estudiante", "nombres")
      .populate("registrador", "nombres");
    //console.log(pagos);
    return res.status(200).json(pagos);
  } catch (error) {
    res.status(400).json(error);
  }
};

//actualizar el pago
export const getPago: RequestHandler = async (req, res) => {
  const pagoFound = await Pagos.findById(req.params.id);
  //console.log(pagoFound);
  if (!pagoFound) return res.status(204).json();

  return res.status(200).json(pagoFound);
};

export const deletePago: RequestHandler = async (req, res) => {
  const dataUpdated = {
    estado: 2,
  };
  const pagoFound = await Pagos.findByIdAndUpdate(req.params.id, dataUpdated, {
    new: true,
  });
  if (!pagoFound) return res.status(204).json();
  return res.status(204).json(pagoFound);
};

export const updatePago: RequestHandler = async (
  req,
  res
): Promise<Response> => {
  //console.log(req.body);
  const { user }: any = req;
  const { role }: any = user;

  /**
   * console.log(req.body);
  if (role === "Super Admin" && req.body.observacion !== undefined) {
    return res.status(404).json({
      message: "No tiene permiso",
    });
  }
   */

  const pagoUpdated = await Pagos.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!pagoUpdated) return res.status(204).json();
  return res.status(200).json(pagoUpdated);
};

//para caja
export const getIngresos: RequestHandler = async (req, res) => {
  const pagos: any = await Pagos.find({ estado: 1 })
    .populate("registrador", "nombres")
    .populate("estudiante", "nombres nro")
    .populate("tramites", "name")
    .populate("sedes", "name");
  res.status(200).json(pagos);
};
