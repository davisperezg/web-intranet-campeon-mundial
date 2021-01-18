import { Router } from "express";
const router = Router();
import passport from "passport";
import {
  ForbiddenStudent,
  ForbiddenAdmin,
  ForbiddenProfesor,
} from "../middlewares/authJwt";
import * as rolesCtrl from "../controllers/roles.controller";

router.get(
  "/v1/roles",
  [
    passport.authenticate("jwt", { session: false }),
    ForbiddenProfesor,
    ForbiddenAdmin,
    ForbiddenStudent,
  ],
  rolesCtrl.getRoles
);

export default router;
