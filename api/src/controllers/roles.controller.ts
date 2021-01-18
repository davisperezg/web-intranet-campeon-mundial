import { Response, RequestHandler } from "express";
import Roles from "../models/Roles";

export const getRoles: RequestHandler = async (req, res) => {
  const JustRoles = await Roles.find({
    name: { $in: ["Super Admin", "Admin", "Profesor"] },
  });
  if (!JustRoles) return res.status(204).json();
  res.status(200).json(JustRoles);
};
