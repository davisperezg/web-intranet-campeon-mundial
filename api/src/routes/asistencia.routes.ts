import { Router } from "express";
const router = Router();
import passport from "passport";
import {
  ForbiddenStudent,
  ForbiddenAdmin,
  ForbiddenProfesor,
} from "../middlewares/authJwt";
import * as asisCtrl from "../controllers/asistencia.controller";

router.post(
  "/v1/asistencia",
  [passport.authenticate("jwt", { session: false }), ForbiddenStudent],
  asisCtrl.newAsistencia
);

//LISTA ASISTENCIA DE TEORIO Y LIBROS X ALUMNO
router.get(
  "/v1/asistencia/alumno/:id",
  [passport.authenticate("jwt", { session: false })],
  asisCtrl.getAsistenciaXAlumno
);

router.get(
  "/v1/asistencia/:id",
  [passport.authenticate("jwt", { session: false }), ForbiddenStudent],
  asisCtrl.getAsistencia
);

router.delete(
  "/v1/asistencia/:id",
  [passport.authenticate("jwt", { session: false }), ForbiddenStudent],
  asisCtrl.deleteAsistencia
);

router.put(
  "/v1/asistencia/:id",
  [passport.authenticate("jwt", { session: false }), ForbiddenStudent],
  asisCtrl.updateAsistencia
);
export default router;
