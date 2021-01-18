import Users from "./../models/Users";
import { Response, RequestHandler } from "express";
import PasswordUtils from "../utils/PasswordBcrypt";
import config from "../config";
//JSONWEBTOKEN
import jwt from "jsonwebtoken";
import Roles from "../models/Roles";
import Sedes from "../models/Sedes";

export const findUser: RequestHandler = async (req, res) => {
  //console.log(req.user);
  res.status(200).json(req.user);
};
//registrar usuario administradores
export const signUp: RequestHandler = async (req, res) => {
  const {
    nombres,
    username,
    email,
    password,
    sedes,
    dni,
    cellphone,
    address,
    telephone,
  } = req.body;
  if (password === undefined) {
    console.log("es undefined");
    return res
      .status(400)
      .json({ password: { message: "Completar Password" } });
  }

  const hashedPassword: string = await PasswordUtils.encryptPassword(password);
  const newUser: any = new Users({
    nombres,
    dni,
    email,
    username,
    cellphone,
    address,
    telephone,
    password: hashedPassword,
    nivel: 2,
    estado: 1,
  });
  //console.log(newUser);
  //Si existe un campo roles
  //if (roles) {
  //busca el id de roles por nombre
  //  const foundRoles = await Roles.find({ name: { $in: roles } });
  //almacena el id en roles
  //  newUser.roles = foundRoles.map((role) => role._id);
  //} else {
  //si no existe el campo roles, aniadimos alumno como defecto
  const role = await Roles.findOne({ name: req.body.roles });
  //almacena el id en roles
  newUser.roles = [role!._id];
  //}

  if (sedes) {
    //busca el id de roles por nombre
    const foundSedes = await Sedes.find({ name: { $in: sedes } });
    //almacena el id en roles
    newUser.sedes = foundSedes.map((sede) => sede._id);
  } else {
    //si no existe el campo roles, aniadimos alumno como defecto
    const sedes = await Sedes.findOne({ name: config.DEFECTO_SEDE });
    //almacena el id en roles
    newUser.sedes = [sedes!._id];
  }

  try {
    await newUser.save();
    res.status(200).json({ message: "Usuario creado" });
  } catch (e) {
    return res.status(400).json(e);
  }
};

export const signIn: RequestHandler = async (req, res) => {
  //parametros ingresados
  const { username, password } = req.body;
  //userFound -> busca al usuario por username obtiene solo 1 y puebla los roles
  const userFound: any = await Users.findOne({ username: username }).populate(
    "roles"
  );
  //si no existe username o no encuentra usuario
  if (!userFound)
    //muestra mensaje
    return res
      .status(400)
      .json({ message: "Usuario y/o contraseña son incorrectos" });
  //matchPassword -> devuelve verdadero o falso al comparar las contrasenias
  const matchPassword = await PasswordUtils.comparePaswword(
    password,
    userFound.password
  );

  //si es false o no existe
  if (!matchPassword)
    //muestra mensaje
    return res
      .status(400)
      .json({ message: "Usuario y/o contraseña son incorrectos" });

  if (userFound.estado === 2) {
    return res.status(400).json({ message: "Acceso denegado" });
  }
  //si todo es exito ejecuta la creación de token
  const token = jwt.sign({ id: userFound._id }, config.SECRET_KEY, {
    expiresIn: config.EXPIRE_KEY,
  });
  res.status(200).json({ token });
};
//registro list delete get update
export const listUsers: RequestHandler = async (req, res) => {
  const JustAlumno = await Roles.findOne({ name: { $in: "Admin" } });
  const { _id }: any = JustAlumno;
  //{roles: { $in: _id },}

  const getUsers: any = await Users.find().populate([
    { path: "sedes" },
    { path: "roles" },
  ]);
  res.status(200).json(getUsers);
};

export const DesUser: RequestHandler = async (req, res) => {
  const data = {
    estado: 2,
  };

  const userFound = await Users.findByIdAndUpdate(req.params.id, data, {
    new: true,
  });

  if (!userFound) return res.status(204).json();

  return res.status(200).json({ message: "Admin deshabilitado" });
};

export const HabUser: RequestHandler = async (req, res) => {
  const data = {
    estado: 1,
  };

  const userFound = await Users.findByIdAndUpdate(req.params.id, data, {
    new: true,
  });

  if (!userFound) return res.status(204).json();

  return res.status(200).json({ message: "Admin deshabilitado" });
};

export const getUser: RequestHandler = async (req, res) => {
  const userFound = await Users.findById(req.params.id).populate([
    { path: "sedes" },
    { path: "roles" },
  ]);

  if (!userFound) return res.status(204).json();

  return res.status(200).json(userFound);
};

export const updateUser: RequestHandler = async (
  req,
  res
): Promise<Response> => {
  //buscar al usuario por params id
  const userFound: any = await Users.findById(req.params.id);
  //despejo roles y password para validar
  console.log(req.body);
  const { roles, password } = req.body;
  if (password) {
    //encriptamos la contrasenia almacenando en una variable y
    //pasamos como parametro el password del body
    const hashedPassword: string = await PasswordUtils.encryptPassword(
      password
    );
    //el password escrito en el body sera enviado a la bd encriptado
    req.body.password = hashedPassword;
  }

  //el username no sera modificado, luego de la busqueda mostrada en la
  //primera linea seteamos el mismo username
  req.body.username = userFound.username;
  const foundSedesActual: any = await Sedes.findOne({
    name: { $in: req.body.sedes },
  });
  req.body.sedes = foundSedesActual._id;

  const foundRol: any = await Roles.findOne({
    name: { $in: req.body.roles },
  });
  req.body.roles = foundRol._id;

  //validamos por si quieren poner forzosamente el rol id del admin
  //if (roles === "5fe50fd11d140e2b20db89e6" || roles === "5fe50fd11d140e2b20db89e6")
  //seteamos el campo roles al usuario normal -> Alumno
  //  req.body.roles = "5fe50fd11d140e2b20db89e7";
  //almacenamos los nuevos datos cambiados
  const userUpdate = await Users.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  //si no existe el params.id no mostramos nada
  if (!userUpdate) return res.status(204).json();
  //si existe mostramos los datos actualizados
  return res.status(200).json(userUpdate);
};
