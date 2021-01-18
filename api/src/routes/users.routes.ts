import { Router } from "express";
const router = Router();
import passport from "passport";
import {
  ForbiddenStudent,
  ForbiddenProfesor,
  ForbiddenSA2,
  ForbiddenAdmin,
} from "../middlewares/authJwt";
import * as authCtrl from "../controllers/users.controller";

//ForbiddenStudent
router.get(
  "/v1/students",
  [passport.authenticate("jwt", { session: false }), ForbiddenStudent],
  authCtrl.listStudents
);

router.get(
  "/v1/students/consult/seq",
  [
    passport.authenticate("jwt", { session: false }),
    ForbiddenProfesor,
    ForbiddenStudent,
  ],
  authCtrl.ConsultNroSeqOfUsername
);

router.get(
  "/v1/students/:id",
  [passport.authenticate("jwt", { session: false }), ForbiddenStudent],
  authCtrl.getStudent
);

router.delete(
  "/v1/students/:id",
  [
    passport.authenticate("jwt", { session: false }),
    ForbiddenProfesor,
    ForbiddenStudent,
  ],
  authCtrl.DesStudent
);

router.put(
  "/v1/activate/students/:id",
  [
    passport.authenticate("jwt", { session: false }),
    ForbiddenProfesor,
    ForbiddenStudent,
  ],
  authCtrl.HabStudent
);

//Registra Estudiantes
router.post(
  "/v1/students",
  [
    passport.authenticate("jwt", { session: false }),
    ForbiddenProfesor,
    ForbiddenStudent,
  ],
  authCtrl.newStudent
);

router.put(
  "/v1/students/:id",
  [passport.authenticate("jwt", { session: false }), ForbiddenProfesor],
  authCtrl.updateStudent
);

router.put(
  "/v1/students/update/seq",
  [
    passport.authenticate("jwt", { session: false }),
    ForbiddenProfesor,
    ForbiddenStudent,
  ],
  authCtrl.updateNeroSeqOfUsername
);

export default router;
