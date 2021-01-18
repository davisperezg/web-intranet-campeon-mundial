import { Router } from "express";
const router = Router();
import passport from "passport";
import {
  ForbiddenStudent,
  ForbiddenAdmin,
  ForbiddenProfesor,
} from "../middlewares/authJwt";
import * as egresosCtrl from "../controllers/egresos.controller";

router.get(
  "/v1/egresos",
  [
    passport.authenticate("jwt", { session: false }),
    ForbiddenStudent,
    ForbiddenProfesor,
  ],
  egresosCtrl.getEgresos
);

router.get(
  "/v1/egresos/admin/:id",
  [
    passport.authenticate("jwt", { session: false }),
    ForbiddenStudent,
    ForbiddenProfesor,
  ],
  egresosCtrl.getEgresosXAdmin
);

router.post(
  "/v1/egresos",
  [
    passport.authenticate("jwt", { session: false }),
    ForbiddenStudent,
    ForbiddenProfesor,
  ],
  egresosCtrl.createEgreso
);

export default router;
