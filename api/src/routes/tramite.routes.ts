import { Router } from "express";
const router = Router();
import passport from "passport";
import {
  ForbiddenStudent,
  ForbiddenAdmin,
  ForbiddenProfesor,
} from "../middlewares/authJwt";
import * as tramiteCtrl from "../controllers/tramite.controller";

router.put(
  "/v1/tramite/:id",
  [
    passport.authenticate("jwt", { session: false }),
    ForbiddenProfesor,
    ForbiddenStudent,
  ],
  tramiteCtrl.updateTramite
);

router.delete(
  "/v1/tramite/:id",
  [
    passport.authenticate("jwt", { session: false }),
    ForbiddenProfesor,
    ForbiddenStudent,
  ],
  tramiteCtrl.deleteTramite
);

router.post(
  "/v1/tramite",
  [
    passport.authenticate("jwt", { session: false }),
    ForbiddenProfesor,
    ForbiddenStudent,
  ],
  tramiteCtrl.postTramite
);

router.get(
  "/v1/tramite",
  [
    passport.authenticate("jwt", { session: false }),
    ForbiddenProfesor,
    ForbiddenStudent,
  ],
  tramiteCtrl.getTramites
);

router.get(
  "/v1/tramite/:id",
  [
    passport.authenticate("jwt", { session: false }),
    ForbiddenProfesor,
    ForbiddenStudent,
  ],
  tramiteCtrl.getTramite
);

export default router;
