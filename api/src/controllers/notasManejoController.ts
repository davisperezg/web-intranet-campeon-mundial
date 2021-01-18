import { Response, RequestHandler } from "express";
import NotasManejo from "../models/NotasManejo";

export const createVideo: RequestHandler = async (req, res) => {
  const { estadoAlumno, etapa, registrador, estudiante } = req.body;
  const newNota = new NotasManejo({
    estadoAlumno,
    etapa,
    registrador,
    estudiante,
    estado: 1,
  });
  try {
    const savedNota = await newNota.save();
    res.status(200).json(savedNota);
  } catch (e) {
    res.status(400).json(e);
  }
};

export const getNotaXAlumno: RequestHandler = async (req, res) => {
  try {
    const foundNotas = await NotasManejo.find({
      estudiante: req.params.id,
      estado: { $in: 1 },
    }).populate("estudiante", "nombres");
    return res.status(200).json(foundNotas);
  } catch (e) {
    return res.status(400).json(e);
  }
};
