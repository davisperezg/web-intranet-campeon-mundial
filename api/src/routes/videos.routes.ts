import { Router } from "express";
const router = Router();
import passport from "passport";
import {
  ForbiddenStudent,
  ForbiddenAdmin,
  ForbiddenProfesor,
} from "../middlewares/authJwt";
import * as videosCtrl from "../controllers/videos.controller";

router.get(
  "/videos",
  [passport.authenticate("jwt", { session: false })],
  videosCtrl.getVideos
);

router.get(
  "/videos/:id",
  [
    passport.authenticate("jwt", { session: false }),
    ForbiddenStudent,
    ForbiddenProfesor,
  ],
  videosCtrl.getVideo
);

router.post(
  "/videos",
  [
    passport.authenticate("jwt", { session: false }),
    ForbiddenStudent,
    ForbiddenProfesor,
  ],
  videosCtrl.createVideo
);

router.delete(
  "/videos/:id",
  [
    passport.authenticate("jwt", { session: false }),
    ForbiddenStudent,
    ForbiddenProfesor,
  ],
  videosCtrl.deleteVideo
);

router.delete(
  "/videos/activate/:id",
  [
    passport.authenticate("jwt", { session: false }),
    ForbiddenStudent,
    ForbiddenProfesor,
  ],
  videosCtrl.habilitarVideo
);

router.put(
  "/videos/:id",
  [
    passport.authenticate("jwt", { session: false }),
    ForbiddenStudent,
    ForbiddenProfesor,
  ],
  videosCtrl.updateVideo
);

export default router;
