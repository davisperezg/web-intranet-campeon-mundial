import { Router } from "express";
const router = Router();
import passport from "passport";
import {
  ForbiddenStudent,
  ForbiddenAdmin,
  ForbiddenProfesor,
} from "../middlewares/authJwt";
import * as documentosCtrl from "../controllers/documentos.controller";

router.get(
  "/v1/alumno/documentos/:id",
  [
    passport.authenticate("jwt", { session: false }),
    ForbiddenProfesor,
    ForbiddenStudent,
  ],
  documentosCtrl.getDocumentos
);

router.get(
  "/v1/documentos/:id",
  [
    passport.authenticate("jwt", { session: false }),
    ForbiddenProfesor,
    ForbiddenStudent,
  ],
  documentosCtrl.getDocumento
);

router.post(
  "/v1/documentos",
  [
    passport.authenticate("jwt", { session: false }),
    ForbiddenProfesor,
    ForbiddenStudent,
  ],
  documentosCtrl.createDocumento
);

router.delete(
  "/v1/documentos/:id",
  [
    passport.authenticate("jwt", { session: false }),
    ForbiddenProfesor,
    ForbiddenStudent,
  ],
  documentosCtrl.deleteDocumento
);

router.put(
  "/v1/documentos/:id",
  [
    passport.authenticate("jwt", { session: false }),
    ForbiddenProfesor,
    ForbiddenStudent,
  ],
  documentosCtrl.updateDocumento
);

export default router;
