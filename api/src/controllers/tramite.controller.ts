import { Response, RequestHandler } from "express";
import Tramite from "../models/Tramite";

export const deleteTramite: RequestHandler = async (req, res) => {
  //console.log(req.body)
  const consultTramite: any = await Tramite.findById(req.params.id);
  console.log(consultTramite);
  const dataUpdated = {
    status: 2,
  };
  const tramiteFound = await Tramite.findByIdAndUpdate(
    req.params.id,
    dataUpdated,
    {
      new: true,
    }
  );
  if (!tramiteFound) return res.status(204).json();
  return res.status(204).json(tramiteFound);
};

export const updateTramite: RequestHandler = async (req, res) => {
  const tramiteUpdated = await Tramite.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
    }
  );
  if (!tramiteUpdated) return res.status(204).json();
  return res.json(tramiteUpdated);
};

export const postTramite: RequestHandler = async (req, res) => {
  console.log(req.body);
  const { name, costo } = req.body;
  const newTramite = new Tramite({
    name,
    costo,
    status: 1,
  });
  const saveTramite = await newTramite.save();
  res.status(200).json(saveTramite);
};

export const getTramites: RequestHandler = async (req, res) => {
  const JustTramitesOne = await Tramite.find({ status: { $in: 1 } });
  if (!JustTramitesOne) return res.status(204).json();
  res.status(200).json(JustTramitesOne);
};

export const getTramite: RequestHandler = async (req, res) => {
  const tramiteFound = await Tramite.findById(req.params.id);
  if (!tramiteFound) return res.status(204).json();
  return res.status(200).json(tramiteFound);
};
