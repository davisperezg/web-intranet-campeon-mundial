import { Response, RequestHandler } from "express";
import ControlAsistencia from "../models/ControlAsistencia";

export const newAsistencia: RequestHandler = async (req, res) => {
  const { estudiante, ingreso, salida, capitulo } = req.body;
  const newAsistencia = new ControlAsistencia({
    estudiante,
    ingreso,
    salida,
    estado: 1,
    capitulo,
  });
  if (!ingreso) {
    return res
      .status(400)
      .json({ message: "Seleccione la fecha y hora de ingreso" });
  }
  if (!salida) {
    return res
      .status(400)
      .json({ message: "Seleccione la fecha y hora de salida" });
  }
  try {
    await newAsistencia.save();
    return res.status(200).json({ message: "Asistencia añadida" });
  } catch (e) {
    if (e.errors.estudiante.path) {
      return res.status(400).json({ message: "Seleccione al estudiante" });
    }
    return res.status(400).json({ message: e });
    //console.log(e.errors.nota.path);
  }
};

export const getAsistenciaXAlumno: RequestHandler = async (req, res) => {
  try {
    const foundAsistencias = await ControlAsistencia.find({
      estudiante: req.params.id,
      estado: { $in: 1 },
    }).populate("estudiante", "nombres");
    return res.status(200).json(foundAsistencias);
  } catch (e) {
    //console.log("entra");
    return res.status(204).json(e);
  }
};

export const getAsistencia: RequestHandler = async (req, res) => {
  const AsistenciaFound = await ControlAsistencia.findById(req.params.id);

  if (!AsistenciaFound) return res.status(204).json();

  return res.json(AsistenciaFound);
};

export const deleteAsistencia: RequestHandler = async (req, res) => {
  const data = {
    estado: 2,
  };
  await ControlAsistencia.findByIdAndUpdate(req.params.id, data, {
    new: true,
  });
  //if (!asistenciaUpdatedDelete) return res.status(204).json();

  return res.status(200).json({ message: "Asistencia eliminada" });
};

export const updateAsistencia: RequestHandler = async (
  req,
  res
): Promise<Response> => {
  const asistenciaUpdated = await ControlAsistencia.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
    }
  );
  if (!asistenciaUpdated) return res.status(204).json();
  return res.json(asistenciaUpdated);
};
