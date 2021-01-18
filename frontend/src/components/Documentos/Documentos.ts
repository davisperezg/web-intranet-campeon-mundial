import { Alumno } from "./../Alumnos/Alumno";

export interface Documentos {
  _id?: string;

  fechaEntregaBalotario: Date | string;
  fechaEntregaCertificadoMedico: Date | string;
  fechaEntregaCertificadoCofipro: Date | string;
  fechaEntregaCarnet: Date | string;
  fechaEntregaGuiaManejo: Date | string;
  fechaEntregaActa: Date | string;
  estudiante: Alumno[] | string;

  observacion?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}
