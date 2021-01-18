import { Response, RequestHandler } from "express";
import ControlNotasTeoricas from "../models/ControlNotasTeoricas";
import Roles from "../models/Roles";
import User from "../models/Users";

export const getAlumnosForNotas: RequestHandler = async (req, res) => {
  try {
    const JustAlumno = await Roles.findOne({
      name: { $in: "Estudiante" },
      //estado: { $in: 1 },
    });
    const { _id }: any = JustAlumno;
    //estado: { $in: 1 }
    const pagos = await User.find({
      roles: { $in: _id },
    })
      .select("nombres")
      .select("username");
    return res.status(200).json(pagos);
  } catch (error) {
    res.status(400).json(error);
  }
};

export const getAlumnoXid: RequestHandler = async (req, res) => {
  try {
    const foundNotas = await ControlNotasTeoricas.find({
      estudiante: req.params.id,
      estado: { $in: 1 },
    })
      .populate("estudiante", "nombres")
      .select("tipoNota")
      .select("nota")
      .select("createdAt");
    return res.status(200).json(foundNotas);
  } catch (e) {
    return res.status(400).json(e);
  }
};

export const getAlumnoXid2: RequestHandler = async (req, res) => {
  try {
    const foundNotas = await ControlNotasTeoricas.find({
      estudiante: req.params.id,
      estado: { $in: 2 },
    })
      .populate("estudiante", "nombres")
      .select("tipoNota")
      .select("nota");
    return res.status(200).json(foundNotas);
  } catch (e) {
    return res.status(400).json(e);
  }
};

export const getAlumnoOne: RequestHandler = async (req, res) => {
  try {
    const foundAlumno = await User.findOne({
      _id: String(req.params.id),
    }).select("nombres");
    //console.log(foundAlumno);
    return res.status(200).json(foundAlumno);
  } catch (e) {
    //console.log("aqui3");
    //console.log(e);
    return res.status(204).json(e);
  }
};
//primera nota = 1
//segundo intento con el valor de la mayor nota = 2
//se ocualta = 3 anteiormente tenia el valor de 1
export const consultListNotasIguales: RequestHandler = async (req, res) => {
  const { tipoNota, estudiante } = req.params;
  const consultNotas = await ControlNotasTeoricas.find({
    tipoNota: tipoNota,
    estudiante: estudiante,
  });
  //console.log(consultNotas.length);
  if (!consultNotas.length) {
    //si 1 tiene 0 registros
    return res.status(200).json({ message: "1" });
  } else if (consultNotas.length === 1) {
    //si 2 tiene 1 registros y le queda 1 oportunidad
    return res.status(200).json({ message: "2" });
  } else {
    //si es 3 tiene 1 y 2 al 100%
    return res.status(200).json({ message: "3" });
  }
};

export const newNota: RequestHandler = async (req, res) => {
  const { tipoNota, nota, estudiante } = req.body;
  const NotaEstado1: any = new ControlNotasTeoricas({
    tipoNota,
    nota,
    estudiante,
    estado: 1,
  });
  try {
    await NotaEstado1.save();
    return res.status(200).json({ message: "Nota creada" });
  } catch (e) {
    //console.log(e);
    //console.log(e.errors.nota.path);
    if (e.errors.nota.path === "nota") {
      return res
        .status(400)
        .json({ message: "El rango de la nota es de 0 a 35" });
    }
    return res.status(400).json({ message: "Seleecione alumno" });
  }
};

export const newNota2: RequestHandler = async (req, res) => {
  const { tipoNota, nota, estudiante } = req.body;
  //registrando la nota 2
  const NotaEstado2: any = new ControlNotasTeoricas({
    tipoNota,
    nota,
    estudiante,
    estado: 2,
  });

  try {
    //alamacena lo registrado con estado 2 en una variable
    const dataRegistered = await NotaEstado2.save();
    //console.log(dataRegistered);
    //obtenemos datos del tipo con estado 1
    const findStatusOne: any = await ControlNotasTeoricas.findOne({
      tipoNota: dataRegistered.tipoNota,
      estado: 1,
    });
    //console.log("busco estado");
    //console.log(findStatusOne);
    //valor que cambiaremos del tipo con estado 1 al 3, 1=3 pero el 3 se oculatara
    const dataUpdateTo3 = {
      estado: 3,
    };
    //actualizamos el id del estado 1 con el estado 3
    await ControlNotasTeoricas.findByIdAndUpdate(
      findStatusOne._id,
      dataUpdateTo3,
      {
        new: true,
      }
    );
    //listamos todos los tipo de nota iguales que pertencen al estudiante
    const ListTipoNotaXEstudiante = await ControlNotasTeoricas.find({
      estudiante: estudiante,
      tipoNota: tipoNota,
    });
    //con lo listado obtenemos un array de objetos, buscaremos y obtenemos las notas
    const ArregloNotas = ListTipoNotaXEstudiante.map(
      (notas: any) => notas.nota
    );
    //alamcenamos la maxima nota
    let maxNotaEntreTipos = Math.max(...ArregloNotas);
    //let mixNotaEntreTipo = Math.min(...ArregloNotas);
    //let notaIgual = (maxNotaEntreTipos = mixNotaEntreTipo);

    //guardamos datos para actualizar y mostrar el segundo intento
    const dataUpdateNota = {
      notaObtuvidaSegundoIntento: nota,
      nota: maxNotaEntreTipos,
    };
    await ControlNotasTeoricas.findByIdAndUpdate(
      dataRegistered._id,
      dataUpdateNota,
      {
        new: true,
      }
    );
    return res.status(200).json({ message: "Nota creada" });
  } catch (e) {
    console.log(e);
    //console.log(e.errors.nota.path);
    if (e.errors.nota.path === "nota") {
      return res
        .status(400)
        .json({ message: "El rango de la nota es de 0 a 35" });
    }
    return res.status(400).json({ message: "Seleecione alumno" });
  }
};
