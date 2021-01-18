import { Router } from "express";
const router = Router();
import passport from "passport";
import {
  MyAccessURL,
  ForbiddenStudent,
  ForbiddenAdmin,
  ForbiddenSA2,
} from "../middlewares/authJwt";
import * as authCtrl from "../controllers/auth.controller";

router.post("/v1/auth/signIn", authCtrl.signIn);

router.get(
  "/v1/auth/user",
  passport.authenticate("jwt", { session: false }),
  authCtrl.findUser
);

//Registra administradores
router.post(
  "/v1/auth/signUp",
  [
    MyAccessURL,
    passport.authenticate("jwt", { session: false }),
    ForbiddenAdmin,
    ForbiddenStudent,
  ],
  authCtrl.signUp
);

//Update administradores
router.put(
  "/v1/user/:id",
  [
    MyAccessURL,
    passport.authenticate("jwt", { session: false }),
    ForbiddenAdmin,
    ForbiddenStudent,
  ],
  authCtrl.updateUser
);

router.get(
  "/v1/user",
  [
    MyAccessURL,
    passport.authenticate("jwt", { session: false }),
    ForbiddenAdmin,
    ForbiddenStudent,
  ],
  authCtrl.listUsers
);

router.get(
  "/v1/user/:id",
  [
    MyAccessURL,
    passport.authenticate("jwt", { session: false }),
    ForbiddenAdmin,
    ForbiddenStudent,
  ],
  authCtrl.getUser
);

router.delete(
  "/v1/user/:id",
  [
    MyAccessURL,
    passport.authenticate("jwt", { session: false }),
    //ForbiddenSA2,
    ForbiddenAdmin,
    ForbiddenStudent,
  ],
  authCtrl.DesUser
);

router.put(
  "/v1/activate/user/:id",
  [
    MyAccessURL,
    passport.authenticate("jwt", { session: false }),
    //ForbiddenSA2,
    ForbiddenAdmin,
    ForbiddenStudent,
  ],
  authCtrl.HabUser
);

export default router;
