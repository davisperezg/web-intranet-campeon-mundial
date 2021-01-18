import { Router } from "express";
const router = Router();
import passport from "passport";
import {
  ForbiddenStudent,
  ForbiddenAdmin,
  ForbiddenProfesor,
} from "../middlewares/authJwt";
import * as pagosCtrl from "../controllers/pagos.controller";

router.get(
  "/v1/alumno/pagos/:id",
  [
    passport.authenticate("jwt", { session: false }),
    ForbiddenProfesor,
    ForbiddenStudent,
  ],
  pagosCtrl.getPagos
);

router.get(
  "/v1/pagos/:id",
  [
    passport.authenticate("jwt", { session: false }),
    ForbiddenProfesor,
    ForbiddenStudent,
  ],
  pagosCtrl.getPago
);

router.post(
  "/v1/pagos",
  [
    passport.authenticate("jwt", { session: false }),
    ForbiddenProfesor,
    ForbiddenStudent,
  ],
  pagosCtrl.createPago
);

router.delete(
  "/v1/pagos/:id",
  [
    passport.authenticate("jwt", { session: false }),
    ForbiddenProfesor,
    ForbiddenStudent,
    ForbiddenAdmin,
  ],
  pagosCtrl.deletePago
);

//revisar vulnerabilidad
router.put(
  "/v1/pagos/:id",
  [
    passport.authenticate("jwt", { session: false }),
    ForbiddenProfesor,
    ForbiddenStudent,
  ],
  pagosCtrl.updatePago
);

router.get(
  "/v1/ingresos",
  [
    passport.authenticate("jwt", { session: false }),
    ForbiddenProfesor,
    ForbiddenStudent,
  ],
  pagosCtrl.getIngresos
);

export default router;
