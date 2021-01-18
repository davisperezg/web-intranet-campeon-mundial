import { Response, RequestHandler } from "express";
import Citas from "../models/Citas";

export const createCita: RequestHandler = async (req, res) => {
  const { estudiante, registrador, fecha } = req.body;

  const newCita = new Citas({
    estudiante,
    registrador,
    fecha,
    estado: 1,
  });

  const saveCita = await newCita.save();

  res.status(200).json(saveCita);
};

export const updateCita: RequestHandler = async (req, res) => {
  const citaUpdate = await Citas.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  if (!citaUpdate) return res.status(204).json();

  return res.status(200).json(citaUpdate);
};

export const getCitas: RequestHandler = async (req, res) => {
  try {
    const citas = await Citas.find({
      estado: 1,
    })
      .populate("registrador", "nombres")
      .populate("estudiante", "nombres nro");
    res.status(200).json(citas);
  } catch (error) {
    res.json(error);
  }
};

export const getCitasXalumno: RequestHandler = async (req, res) => {
  try {
    const citasXalumno = await Citas.find({
      estudiante: { $in: req.params.idestudiante },
      estado: { $in: 1 },
    })
      .populate("registrador", "nombres")
      .populate("estudiante", "nombres nro");
    console.log(citasXalumno);
    res.status(200).json(citasXalumno);
  } catch (error) {
    res.json(error);
  }
};

export const getCita: RequestHandler = async (req, res) => {
  const citaFound = await Citas.findById(req.params.id)
    .populate("registrador", "nombres")
    .populate("estudiante", "nombres nro");

  if (!citaFound) return res.status(204).json();

  return res.status(200).json(citaFound);
};
