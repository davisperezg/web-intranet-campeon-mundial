import { Response, RequestHandler } from "express";
import Pagos from "../models/Pagos";
import Tramite from "../models/Tramite";
import Users from "../models/Users";

export const createPago: RequestHandler = async (req, res) => {
  const {
    registrador,
    estudiante,
    cantidad,
    nroRecibo,
    tramites,
    stateRenta,
    acuenta,
  } = req.body;

  try {
    if (!tramites) {
      return res.status(404).json({ message: "Seleccione un tramite" });
    }

    if (!cantidad) {
      return res.status(400).json({ message: "Ingrese la unidad" });
    }
    //busqueda de tramite
    const tramiteFound: any = await Tramite.findOne({
      name: { $in: tramites },
    });

    if (nroRecibo <= 0) {
      return res.status(400).json({ message: "Ingrese el nro de recibo" });
    }

    if (!acuenta || acuenta < 0) {
      req.body.acuenta = 0;
      const calRestante =
        Number(tramiteFound.costo) * Number(cantidad) -
        Number(req.body.acuenta);
      const sumaAcuenta = Number(req.body.acuenta) + calRestante;
      req.body.acuenta = sumaAcuenta;
    }

    const validateNroRecibo = await Pagos.findOne({
      nroRecibo: { $in: nroRecibo },
    });

    if (validateNroRecibo) {
      return res
        .status(404)
        .json({ message: "Se encontró un nro de recibo repetido" });
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

    if (stateRenta === true && acuenta <= 0) {
      return res.status(400).json({
        message: "Si el alumno está dejando dinero a cuenta, ingresar el monto",
      });
    }
    if (stateRenta === false && acuenta > 0) {
      return res.status(400).json({
        message:
          "Si el alumno está dejando dinero a cuenta, marque el check. Si no coloque el monto a cuenta a 0",
      });
    }

    const calValores = cantidad * tramiteFound.costo;
    if (Number(acuenta) > Number(calValores)) {
      return res.status(400).json({
        message:
          "El monto a cuenta no puede ser superior al total del tramite que es S/ " +
          calValores,
      });
    }

    //console.log(estudiante);
    const userFound: any = await Users.findOne({
      _id: { $in: estudiante },
    });

    if (stateRenta) {
      req.body.confirm = 2;
    } else {
      req.body.confirm = 1;
    }

    const newPago = new Pagos({
      confirm: req.body.confirm,
      registrador,
      estudiante,
      cantidad,
      nroRecibo,
      stateRenta,
      tramites: tramiteFound._id,
      estado: 1,
      acuenta: req.body.acuenta,
      sedes: userFound.sedes[0],
    });

    const savedPago = await newPago.save();
    res.status(200).json(savedPago);
  } catch (e) {
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
      .populate("registrador", "nombres")
      .populate("tramites", "name costo");
    //console.log(pagos);
    return res.status(200).json(pagos);
  } catch (error) {
    res.status(400).json(error);
  }
};

//actualizar el pago
export const getPago: RequestHandler = async (req, res) => {
  const pagoFound = await Pagos.findById(req.params.id)
    .populate("tramites", "name costo")
    .select("cantidad")
    .select("nroRecibo")
    .select("stateRenta")
    .select("acuenta")
    .select("registrador");
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
  const { nuevoMonto, stateRenta, tramites, _id } = req.body;

  let tramiteFound: any = null;
  try {
    tramiteFound = await Tramite.findOne({
      name: tramites,
    });
  } catch (e) {
    res.status(400).json({
      message: "No se encuentra el tramite",
    });
  }

  const pagoFound: any = await Pagos.findOne({
    _id: _id,
  });

  req.body.tramites = tramiteFound._id;
  if (stateRenta === false) {
    if (Number(pagoFound.acuenta) === Number(tramiteFound.costo)) {
      return res.status(400).json({
        message: "Ya se realizó el pago",
      });
    }
    if (Number(pagoFound.nuevoMonto) === 0 && Number(pagoFound.acuenta) === 0) {
      return res.status(400).json({
        message: "Ya se realizó el pago",
      });
    }
    req.body.confirm = 1;

    const calRestante =
      Number(tramiteFound.costo) * Number(pagoFound.cantidad) -
      Number(pagoFound.acuenta);
    const sumaAcuenta = Number(pagoFound.acuenta) + calRestante;
    req.body.acuenta = sumaAcuenta;
    const pagoUpdated = await Pagos.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!pagoUpdated) return res.status(204).json();
    return res.status(200).json(pagoUpdated);
  } else {
    if (Number(pagoFound.nuevoMonto) === 0 && Number(pagoFound.acuenta) === 0) {
      return res.status(400).json({
        message: "Ya se realizó el pago",
      });
    }
    if (Number(pagoFound.acuenta) === Number(tramiteFound.costo)) {
      return res.status(400).json({
        message: "Ya se realizó el pago",
      });
    }

    if (
      !Number(nuevoMonto) ||
      Number(nuevoMonto) < 0 ||
      Number(nuevoMonto) === undefined
    ) {
      req.body.nuevoMonto = 0;
    }
    if (stateRenta === true && Number(req.body.nuevoMonto) <= 0) {
      return res.status(400).json({
        message: "Si el alumno está dejando dinero a cuenta, ingresar el monto",
      });
    }
    if (stateRenta === false && Number(req.body.nuevoMonto) > 0) {
      return res.status(400).json({
        message:
          "Si el alumno está dejando dinero a cuenta, marque el check. Si no coloque el monto a cuenta a 0",
      });
    }

    const calValores = Number(pagoFound.cantidad) * Number(tramiteFound.costo);
    const CalnuevoMonto =
      Number(req.body.nuevoMonto) + Number(pagoFound.acuenta);

    if (Number(CalnuevoMonto) > Number(calValores)) {
      return res.status(400).json({
        message:
          "El monto a cuenta no puede ser superior al total restante que es S/ " +
          (Number(calValores) - Number(pagoFound.acuenta)),
      });
    }

    if (Number(CalnuevoMonto) === Number(calValores)) {
      req.body.stateRenta = false;
      req.body.confirm = 1;
    }

    req.body.nuevoMonto = nuevoMonto;
    req.body.acuenta = CalnuevoMonto;

    const pagoUpdated = await Pagos.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!pagoUpdated) return res.status(204).json();
    return res.status(200).json(pagoUpdated);
  }
};

//para caja
export const getIngresos: RequestHandler = async (req, res) => {
  const pagos: any = await Pagos.find({ estado: 1 })
    .populate("registrador", "nombres")
    .populate("tramites", "name costo")
    .populate("sedes", "name")
    .populate("estudiante", "nombres nro cellphone telephone");

  res.status(200).json(pagos);
};
