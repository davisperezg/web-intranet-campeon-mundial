import { Response, RequestHandler } from "express";
import ControlPracticasHorario from "../models/ControlPracticasHorario";
import Roles from "../models/Roles";
import Users from "../models/Users";

export const createPractice: RequestHandler = async (req, res) => {
  const { fecha, horaInicio, horaSalida, estudiante, profesor, nro } = req.body;
  const newPractica = new ControlPracticasHorario({
    profesor,
    fecha,
    horaInicio,
    horaSalida,
    estudiante,
    estado: 1,
    nro,
  });
  try {
    if (!fecha) {
      return res.status(400).json({ message: "Seleccione la fecha" });
    }
    if (!horaInicio) {
      return res.status(400).json({ message: "Seleccione la hora de inicio" });
    }
    if (!horaSalida) {
      return res
        .status(400)
        .json({ message: "Seleccione la hora que termina" });
    }
    if (estudiante === "NOSELECT") {
      return res.status(400).json({ message: "Seleccione alumno" });
    }
    if (profesor === "NOSELECT") {
      return res.status(400).json({ message: "Seleccione profesor" });
    }
    if (nro === "NOSELECT") {
      return res.status(400).json({ message: "Seleccione nro de practica" });
    }
    const savedPractica = await newPractica.save();
    res.status(200).json(savedPractica);
  } catch (e) {
    return res.status(400).json({ message: e });
  }
};

export const getProfesores: RequestHandler = async (req, res) => {
  try {
    const JustAlumno = await Roles.findOne({
      name: { $in: "Profesor" },
      //estado: { $in: 1 },
    });
    const { _id }: any = JustAlumno;
    //estado: { $in: 1 }
    const profesores = await Users.find({
      roles: { $in: _id },
    }).select("nombres");
    return res.status(200).json(profesores);
  } catch (error) {
    res.status(400).json(error);
  }
};

export const getAlumnosXPracticas: RequestHandler = async (req, res) => {
  //console.log(req.params.id);
  try {
    const foundPracticas = await ControlPracticasHorario.find({
      estudiante: req.params.id,
      estado: { $in: 1 },
    })
      .populate("estudiante", "nombres")
      .populate("profesor", "nombres")
      .select("nro")
      .select("fecha")
      .select("horaInicio")
      .select("horaSalida");
    return res.status(200).json(foundPracticas);
  } catch (e) {
    //console.log("entra");
    return res.status(204).json(e);
  }
};

export const getPractica: RequestHandler = async (req, res) => {
  const practicaFound = await ControlPracticasHorario.findById(req.params.id);

  if (!practicaFound) return res.status(204).json();

  return res.json(practicaFound);
};

export const deletePractica: RequestHandler = async (req, res) => {
  const data = {
    estado: 2,
  };
  const practicaUpdatedDelete = await ControlPracticasHorario.findByIdAndUpdate(
    req.params.id,
    data,
    {
      new: true,
    }
  );
  if (!practicaUpdatedDelete) return res.status(204).json();

  return res.status(204).json({ message: "Practica eliminada" });
};

export const updatePractica: RequestHandler = async (
  req,
  res
): Promise<Response> => {
  const practicaUpdated = await ControlPracticasHorario.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
    }
  );
  if (!practicaUpdated) return res.status(204).json();
  return res.json(practicaUpdated);
};
