import { Response, RequestHandler } from "express";
import Documentos from "../models/Documentos";

export const createDocumento: RequestHandler = async (req, res) => {
  try {
    req.body.estado = 1;
    const newDocumento = new Documentos(req.body);
    const savedDocumento = await newDocumento.save();
    res.status(200).json(savedDocumento);
  } catch (e) {
    console.log(e);
    res.status(400).json(e);
  }
};

export const getDocumentos: RequestHandler = async (req, res) => {
  try {
    const documentos = await Documentos.find({
      estudiante: { $in: req.params.id },
      estado: { $in: 1 },
    }).populate("estudiante", "nombres");
    console.log(documentos);
    return res.status(200).json(documentos);
  } catch (error) {
    res.status(400).json(error);
  }
};

export const getDocumento: RequestHandler = async (req, res) => {
  const DocumentoFound = await Documentos.findById(req.params.id);

  if (!DocumentoFound) return res.status(204).json();

  return res.status(200).json(DocumentoFound);
};

export const deleteDocumento: RequestHandler = async (req, res) => {
  const dataUpdated = {
    estado: 2,
  };
  const DocumentoFound = await Documentos.findByIdAndUpdate(
    req.params.id,
    dataUpdated,
    {
      new: true,
    }
  );
  if (!DocumentoFound) return res.status(204).json();
  return res.status(204).json(DocumentoFound);
};

export const updateDocumento: RequestHandler = async (
  req,
  res
): Promise<Response> => {
  const { user }: any = req;
  const { role }: any = user;

  /**
   * if (role === "Super Admin" && !req.body.observacion) {
    return res.status(404).json({
      message: "No tiene permiso",
    });
  }
   */

  const DocumentoUpdated = await Documentos.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
    }
  );
  if (!DocumentoUpdated) return res.status(204).json();
  return res.status(200).json(DocumentoUpdated);
};
