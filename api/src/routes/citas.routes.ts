import { Router } from "express";
const router = Router();
import passport from "passport";
import {
  ForbiddenStudent,
  ForbiddenAdmin,
  ForbiddenProfesor,
} from "../middlewares/authJwt";
import * as citasCtrl from "../controllers/citas.controller";

router.get(
  "/v1/citas",
  [
    passport.authenticate("jwt", { session: false }),
    ForbiddenProfesor,
    ForbiddenStudent,
  ],
  citasCtrl.getCitas
);

router.get(
  "/v1/citas/alumno/:idestudiante",
  [
    passport.authenticate("jwt", { session: false }),
    ForbiddenProfesor,
    ForbiddenStudent,
  ],
  citasCtrl.getCitasXalumno
);

router.get(
  "/v1/citas/:id",
  [
    passport.authenticate("jwt", { session: false }),
    ForbiddenProfesor,
    ForbiddenStudent,
  ],
  citasCtrl.getCita
);

router.post(
  "/v1/citas",
  [
    passport.authenticate("jwt", { session: false }),
    ForbiddenProfesor,
    ForbiddenStudent,
  ],
  citasCtrl.createCita
);

//revisar vulnerabilidad
router.put(
  "/v1/citas/:id",
  [
    passport.authenticate("jwt", { session: false }),
    ForbiddenProfesor,
    ForbiddenStudent,
  ],
  citasCtrl.updateCita
);

export default router;
