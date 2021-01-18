import { Router } from "express";
const router = Router();
import passport from "passport";
import {
  ForbiddenStudent,
  ForbiddenAdmin,
  ForbiddenProfesor,
} from "../middlewares/authJwt";
import * as sedesCtrl from "../controllers/sedes.controller";

router.put(
  "/v1/sedes/:id",
  [
    passport.authenticate("jwt", { session: false }),
    ForbiddenProfesor,
    ForbiddenStudent,
    ForbiddenAdmin,
  ],
  sedesCtrl.updateSeq
);

router.get(
  "/v1/sedes",
  [
    passport.authenticate("jwt", { session: false }),
    ForbiddenProfesor,
    ForbiddenStudent,
    ForbiddenAdmin,
  ],
  sedesCtrl.listSedes
);

router.get(
  "/v1/sedes/:id",
  [
    passport.authenticate("jwt", { session: false }),
    ForbiddenProfesor,
    ForbiddenStudent,
    ForbiddenAdmin,
  ],
  sedesCtrl.getSede
);

export default router;
