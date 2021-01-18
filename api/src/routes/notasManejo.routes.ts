import { Router } from "express";
const router = Router();
import passport from "passport";
import {
  ForbiddenStudent,
  ForbiddenAdmin,
  ForbiddenProfesor,
} from "../middlewares/authJwt";
import * as notasCtrl from "../controllers/notasManejoController";

router.post(
  "/v1/nota/manejo",
  [
    passport.authenticate("jwt", { session: false }),
    ForbiddenStudent,
    ForbiddenAdmin,
  ],
  notasCtrl.createVideo
);

router.get(
  "/v1/nota/manejo/alumno/:id",
  [passport.authenticate("jwt", { session: false })],
  notasCtrl.getNotaXAlumno
);

export default router;
