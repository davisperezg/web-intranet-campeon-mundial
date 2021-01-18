import { Router } from "express";
const router = Router();
import passport from "passport";
import {
  ForbiddenStudent,
  ForbiddenAdmin,
  ForbiddenProfesor,
} from "../middlewares/authJwt";
import * as practicaCtrl from "../controllers/practicas.controller";

router.post(
  "/v1/practicas",
  [passport.authenticate("jwt", { session: false }), ForbiddenStudent],
  practicaCtrl.createPractice
);

router.get(
  "/v1/profesores",
  [passport.authenticate("jwt", { session: false }), ForbiddenStudent],
  practicaCtrl.getProfesores
);

router.get(
  "/v1/practicas/alumno/:id",
  [passport.authenticate("jwt", { session: false })],
  practicaCtrl.getAlumnosXPracticas
);

router.put(
  "/v1/practicas/:id",
  [passport.authenticate("jwt", { session: false }), ForbiddenStudent],
  practicaCtrl.updatePractica
);

router.delete(
  "/v1/practicas/:id",
  [passport.authenticate("jwt", { session: false }), ForbiddenStudent],
  practicaCtrl.deletePractica
);

//obtiene por id la practica
router.get(
  "/v1/practicas/:id",
  [passport.authenticate("jwt", { session: false }), ForbiddenStudent],
  practicaCtrl.getPractica
);
export default router;
