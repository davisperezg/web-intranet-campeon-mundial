import ContUsername from "../models/ContUsername";
import Roles from "../models/Roles";
import Sedes from "../models/Sedes";
export const createRoles = async () => {
  try {
    const count = await Roles.estimatedDocumentCount();
    if (count > 0) return;

    const values = await Promise.all([
      new Roles({ name: "Super Admin" }).save(),
      new Roles({ name: "Admin" }).save(),
      new Roles({ name: "Profesor" }).save(),
      new Roles({ name: "Estudiante" }).save(),
    ]);
    console.log(values);
  } catch (e) {
    console.log(e);
  }
};

export const createSedes = async () => {
  try {
    const count = await Sedes.estimatedDocumentCount();
    if (count > 0) return;

    const values = await Promise.all([
      new Sedes({ name: "Huacho", seq: 1 }).save(),
      new Sedes({ name: "Huaral", seq: 1 }).save(),
      new Sedes({ name: "Barranca", seq: 1 }).save(),
    ]);
    console.log(values);
  } catch (e) {
    console.log(e);
  }
};

export const createSeqUsername = async () => {
  try {
    const count = await ContUsername.estimatedDocumentCount();
    if (count > 0) return;

    const values = await Promise.all([new ContUsername({ seq: 10000 }).save()]);
    console.log(values);
  } catch (e) {
    console.log(e);
  }
};
