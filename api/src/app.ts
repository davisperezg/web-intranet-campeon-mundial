import express from "express";
import morgan from "morgan";
import cors from "cors";
import videosRoutes from "./routes/videos.routes";
import authRoutes from "./routes/auth.routes";
import usersRoutes from "./routes/users.routes";
import sedesRoutes from "./routes/sedes.routes";
import rolesRoutes from "./routes/roles.routes";
import pagosRoutes from "./routes/pagos.routes";
import documentosRoutes from "./routes/documentos.routes";
import notasRoutes from "./routes/notas.routes";
import asistenciaRoutes from "./routes/asistencia.routes";
import tramitesRoutes from "./routes/tramite.routes";
import practicasRoutes from "./routes/practicas.routes";
import egresosRoutes from "./routes/egresos.routes";
import citasRoutes from "./routes/citas.routes";
import notasTeoricasRoutes from "./routes/notasManejo.routes";

import {
  createRoles,
  createSedes,
  createSeqUsername,
} from "./libs/initialSetup";
import passport from "passport";
import passportModdleware from "./middlewares/passport";
import helmet from "helmet";

const app = express();
createRoles();
createSedes();
createSeqUsername();
app.set("port", process.env.PORT || 3000);

app.use(morgan("dev"));
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());
passport.use(passportModdleware);
app.use(videosRoutes);
app.use(authRoutes);
app.use(usersRoutes);
app.use(sedesRoutes);
app.use(tramitesRoutes);
app.use(rolesRoutes);
app.use(pagosRoutes);
app.use(documentosRoutes);
app.use(notasRoutes);
app.use(asistenciaRoutes);
app.use(practicasRoutes);
app.use(egresosRoutes);
app.use(citasRoutes);
app.use(notasTeoricasRoutes);

export default app;
