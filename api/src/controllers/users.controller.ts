import { Response, RequestHandler } from "express";
import ContUsername from "../models/ContUsername";
import Roles from "../models/Roles";
import Sedes from "../models/Sedes";
import Tramite from "../models/Tramite";
import Users from "../models/Users";
import PasswordUtils from "../utils/PasswordBcrypt";

export const listStudents: RequestHandler = async (req: any, res) => {
  const JustAlumno = await Roles.findOne({ name: { $in: "Estudiante" } });
  const { _id }: any = JustAlumno;

  //console.log("USU");
  //console.log(req.user);
  //console.log("LISTA DE REGISTRADOS CON ID");
  //inicia la lista de a quienes se les retistro
  const foundCantOfEnrolled = await Users.find({
    registrador: { $in: req.user.id },
  });
  //termina la lista de quien registro a este cliente

  const getUsersXStudents: any = await Users.find({
    roles: { $in: _id },
  }).populate([{ path: "sedes" }]);
  res.status(200).json(getUsersXStudents);
};

export const getStudent: RequestHandler = async (req, res) => {
  const userFound = await Users.findById(req.params.id).populate([
    { path: "sedes" },
  ]);

  if (!userFound) return res.status(204).json();

  return res.status(200).json(userFound);
};

//registra alumnos o estudiantes
export const newStudent: RequestHandler = async (req, res) => {
  const {
    password,
    dni,
    nombres,
    username,
    email,
    cellphone,
    telephone,
    address,
    startClasses,
    endClasses,
    sedes, //si existe sede busca nombre, si no existe sede Huacho por defecto
    //tramites,
    registrador,
  } = req.body;

  const hashedPassword: string = await PasswordUtils.encryptPassword(password);

  const newStudent: any = new Users({
    password: hashedPassword,
    dni,
    nombres,
    username,
    email,
    cellphone,
    telephone,
    address,
    startClasses,
    endClasses,
    registrador,
    estado: 1,
  });

  //si no existe el campo roles, aniadimos alumno como defecto
  const role = await Roles.findOne({ name: "Estudiante" });
  //almacena el id en roles
  newStudent.roles = [role!._id];

  if (sedes) {
    //busca el id de roles por nombre
    const foundSedes = await Sedes.find({ name: { $in: sedes } });
    //almacena el id en roles
    newStudent.sedes = foundSedes.map((sede) => sede._id);
  } else {
    //si no existe el campo roles, aniadimos alumno como defecto
    const sedes = await Sedes.findOne({ name: "Huacho" });
    //almacena el id en roles
    newStudent.sedes = [sedes!._id];
  }

  //const foundTramites = await Tramite.find({ name: { $in: tramites } });
  //newStudent.tramites = foundTramites.map((tramite) => tramite._id);
  //buscar la sede del alumno y acutliza sus nro de matricula

  const getNumberMatricula = <any>await Sedes.findOne({
    _id: newStudent.sedes,
  })
    .sort({ $natural: -1 })
    .limit(1);

  newStudent.nro = getNumberMatricula.seq;

  const incNumSeqSede = async () => {
    const searchNum: any = await Sedes.findOne({
      name: getNumberMatricula.name,
    });
    const dataUpdate = {
      seq: getNumberMatricula.seq + 1,
    };
    await Sedes.findByIdAndUpdate(searchNum._id, dataUpdate, {
      new: true,
    });
  };
  //fin de buscar y actualizar sus numero de ficha

  try {
    const dataRegistro = await newStudent.save();
    await incNumSeqSede();
    res.status(200).json(dataRegistro);
  } catch (e) {
    console.log(e);
    return res.status(400).json(e);
  }
};
export const updateStudent: RequestHandler = async (
  req,
  res
): Promise<Response> => {
  //buscar al usuario por params id
  const userFound: any = await Users.findById(req.params.id);
  //despejo roles y password para validar
  //console.log(req.body);
  const { password } = req.body;
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
    _id: { $in: userFound.sedes },
  });

  if (req.body.sedes === foundSedesActual.name) {
    //la sede ingresada es igual a la que tenia
    req.body.sedes = foundSedesActual._id;
  } else {
    //la sede ingresada es diferente a la que tenia
    const foundSedes: any = await Sedes.findOne({
      name: { $in: req.body.sedes },
    });
    req.body.sedes = foundSedes._id;

    const getNumberMatricula = <any>await Sedes.findOne({
      _id: foundSedes._id,
    });

    try {
      req.body.nro = getNumberMatricula.seq;
      const userUpdate = await Users.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
        }
      );
      const dataUpdateSeq = {
        seq: getNumberMatricula.seq + 1,
      };
      await Sedes.findByIdAndUpdate(getNumberMatricula._id, dataUpdateSeq, {
        new: true,
      });
      return res.status(200).json(userUpdate);
    } catch (e) {
      console.log(e);
    }
  }

  const userUpdate = await Users.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  //si no existe el params.id no mostramos nada
  if (!userUpdate) return res.status(204).json();
  //si existe mostramos los datos actualizados
  return res.status(200).json(userUpdate);
};
export const DesStudent: RequestHandler = async (req, res) => {
  const data = {
    estado: 2,
  };
  const studentFound = await Users.findByIdAndUpdate(req.params.id, data, {
    new: true,
  });

  if (!studentFound) return res.status(204).json();

  return res.status(200).json({ message: "Estudiante eliminado" });
};

export const HabStudent: RequestHandler = async (req, res) => {
  const data = {
    estado: 1,
  };
  const studentFound = await Users.findByIdAndUpdate(req.params.id, data, {
    new: true,
  });

  if (!studentFound) return res.status(204).json();

  return res.status(200).json({ message: "Estudiante eliminado" });
};

export const updateSeqUsername: RequestHandler = async (
  req,
  res
): Promise<Response> => {
  const consultSeq: any = await ContUsername.findOne({ _id: req.params.id });

  if (req.body.seq <= consultSeq.seq) {
    return res.status(400).json({
      message: "No puede ingresar una secuencia menor a la que tenia",
    });
  }
  const contUpdate = await ContUsername.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
    }
  );
  if (!contUpdate) return res.status(204).json();
  return res.json(contUpdate);
};

export const ConsultNroSeqOfUsername: RequestHandler = async (req, res) => {
  const getNumberUsername: any = await ContUsername.findOne()
    .sort({ $natural: -1 })
    .limit(1);
  res.status(200).json(getNumberUsername);
};

export const updateNeroSeqOfUsername: RequestHandler = async (req, res) => {
  const getNumberUsername: any = await ContUsername.findOne()
    .sort({ $natural: -1 })
    .limit(1);
  const dataUpdate = {
    seq: getNumberUsername.seq + 1,
  };
  const seqUpdate = await ContUsername.findByIdAndUpdate(
    getNumberUsername._id,
    dataUpdate,
    {
      new: true,
    }
  );
  res.status(200).json(seqUpdate);
};
