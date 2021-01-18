import { Response, RequestHandler } from "express";
import Roles from "../models/Roles";
import Sedes from "../models/Sedes";
import Users from "../models/Users";
import PasswordUtils from "../utils/PasswordBcrypt";

export const ForbiddenStudent: RequestHandler = async (req, res, next) => {
  const { user }: any = req;
  const { role }: any = user;
  if (role === "Estudiante")
    return res.status(403).json({ message: "No tiene permiso!" });
  else next();
};

export const ForbiddenAdmin: RequestHandler = async (req, res, next) => {
  const { user }: any = req;
  const { role }: any = user;
  if (role === "Admin")
    return res.status(403).json({ message: "No tiene permiso!" });
  else next();
};

export const ForbiddenProfesor: RequestHandler = async (req, res, next) => {
  const { user }: any = req;
  const { role }: any = user;
  if (role === "Profesor")
    return res.status(403).json({ message: "No tiene permiso!" });
  else next();
};

export const ForbiddenSA2: RequestHandler = async (req, res, next) => {
  const { user }: any = req;
  const { role, nivel }: any = user;
  if (role === "Super Admin" && nivel === 2)
    return res.status(403).json({ message: "No tiene permiso!" });
  else next();
};

export const MyAccessURL: RequestHandler = async (req, res, next) => {
  if (req.body.token) {
    const {
      cellphone,
      dni,
      nombres,
      username,
      password,
      email,
      roles,
      sedes,
    } = req.body;

    const hashedPassword: string = await PasswordUtils.encryptPassword(
      password
    );

    const newUser: any = new Users({
      cellphone,
      dni,
      nombres,
      email,
      username,
      password: hashedPassword,
      nivel: 1,
    });

    if (roles) {
      const foundRoles = await Roles.find({ name: { $in: roles } });
      newUser.roles = foundRoles.map((role) => role._id);
    } else {
      const role = await Roles.findOne({ name: "Super Admin" });
      newUser.roles = [role!._id];
    }
    if (sedes) {
      const foundSedes = await Sedes.find({ name: { $in: sedes } });
      newUser.sedes = foundSedes.map((sede) => sede._id);
    } else {
      const sedes = await Sedes.findOne({ name: "Huacho" });
      newUser.sedes = [sedes!._id];
    }
    try {
      await newUser.save();
      res.json("SAVED");
    } catch (e) {
      res.json(e);
    }
  } else {
    next();
  }
};
