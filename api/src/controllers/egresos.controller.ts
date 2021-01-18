import { Response, RequestHandler } from "express";
import Egresos from "../models/Egresos";
import Users from "../models/Users";

export const createEgreso: RequestHandler = async (req, res) => {
  const { detalle, cantidad, registrador } = req.body;
  if (!detalle) {
    return res.status(400).json({ message: "Completar detalle" });
  }
  if (!cantidad) {
    return res.status(400).json({ message: "Completar cantidad" });
  }
  if (!registrador) {
    return res.status(400).json({
      message:
        "Error al registrar al secretario o secretaria. Por favor vuelva a iniciar sesión",
    });
  }
  const findUser: any = await Users.findOne({ _id: registrador });
  //console.log(findUser.sedes);
  const newEgreso = new Egresos({
    detalle,
    cantidad,
    estado: 1,
    registrador,
    sedes: findUser.sedes,
  });
  try {
    const savedEgreso = await newEgreso.save();
    return res.status(200).json(savedEgreso);
  } catch (e) {
    return res.status(400).json({ message: e });
  }
};

export const getEgresos: RequestHandler = async (req, res) => {
  try {
    const egresos = await Egresos.find({ estado: 1 })
      .populate("registrador", "nombres")
      .populate("sedes", "name");
    console.log(egresos);
    return res.status(200).json(egresos);
  } catch (e) {
    return res.status(400).json(e);
  }
};

export const getEgresosXAdmin: RequestHandler = async (req, res) => {
  try {
    const egresos = await Egresos.find({
      registrador: req.params.id,
      estado: 1,
    })
      .populate("registrador", "nombres")
      .populate("sedes", "name");
    //console.log(egresos);
    return res.status(200).json(egresos);
  } catch (e) {
    return res.status(400).json(e);
  }
};
