import { Response, RequestHandler } from "express";
import Sedes from "../models/Sedes";

export const updateSeq: RequestHandler = async (
  req,
  res
): Promise<Response> => {
  const consultSeq: any = await Sedes.findOne({ _id: req.params.id });

  if (req.body.seq <= consultSeq.seq) {
    return res.status(400).json({
      message: "No puede ingresar una secuencia menor a la que tenia",
    });
  }
  const contUpdate = await Sedes.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!contUpdate) return res.status(204).json();
  return res.json(contUpdate);
};

export const listSedes: RequestHandler = async (req, res) => {
  const getSedes = await Sedes.find();
  res.status(200).json(getSedes);
};

export const getSede: RequestHandler = async (req, res) => {
  const sedeFound = await Sedes.findById(req.params.id);

  if (!sedeFound) return res.status(204).json();

  return res.json(sedeFound);
};
