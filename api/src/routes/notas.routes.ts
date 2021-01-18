import { Router } from "express";
const router = Router();
import passport from "passport";
import {
  ForbiddenStudent,
  ForbiddenAdmin,
  ForbiddenProfesor,
} from "../middlewares/authJwt";
import * as notasCtrl from "../controllers/notas.controllers";

router.get(
  "/v1/alumnos",
  [passport.authenticate("jwt", { session: false }), ForbiddenStudent],
  notasCtrl.getAlumnosForNotas
);

router.get(
  "/v1/alumnos/validate/:tipoNota/:estudiante",
  [passport.authenticate("jwt", { session: false }), ForbiddenStudent],
  notasCtrl.consultListNotasIguales
);

//ForbiddenStudent LISTA LAS NOTAS DEL ALUMNO - TEORIA
router.get(
  "/v1/alumnos/notas/:id",
  [passport.authenticate("jwt", { session: false })],
  notasCtrl.getAlumnoXid
);

//ForbiddenStudent LISTA LAS NOTAS DEL ALUMNO - TEORIA
router.get(
  "/v1/alumnos/notass/:id",
  [passport.authenticate("jwt", { session: false })],
  notasCtrl.getAlumnoXid2
);

router.get(
  "/v1/alumnos/name/:id",
  [passport.authenticate("jwt", { session: false }), ForbiddenStudent],
  notasCtrl.getAlumnoOne
);

router.post(
  "/v1/notas",
  [
    passport.authenticate("jwt", { session: false }),
    ForbiddenStudent,
    //ForbiddenAdmin,
  ],
  notasCtrl.newNota
);

router.post(
  "/v1/notass",
  [
    passport.authenticate("jwt", { session: false }),
    ForbiddenStudent,
    //ForbiddenAdmin,
  ],
  notasCtrl.newNota2
);

export default router;
