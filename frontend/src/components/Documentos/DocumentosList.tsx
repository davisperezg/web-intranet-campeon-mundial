import React, { useState, useEffect, useContext } from "react";
import { Documentos } from "./Documentos";
import { useParams } from "react-router-dom";
import * as documentosService from "./DocumentosService";
import DocumentosForm from "./DocumentosForm";
import DocumentosItem from "./DocumentosItem";
import * as alumnoService from "../Alumnos/AlumnoService";
import { UserContext } from "../Context/UserContext";
import MostarSesionTerminada from "../lib/SesionTerminada";

interface Params {
  id?: string;
}

const DocumentosList = () => {
  const [loading, setLoading] = useState(true);
  const params: any = useParams<Params>();
  const [documentos, setDocumentos] = useState<Documentos[]>([]);
  const [alumno, setAlumno] = useState<any>({});
  const { userData }: any = useContext(UserContext);
  const loadDocumentos = async () => {
    const res = await documentosService.getDocumentos(params.id);
    const formatedPagos = res.data
      .map((dcs) => {
        return {
          ...dcs,
          createdAt: dcs.createdAt ? new Date(dcs.createdAt) : new Date(),
          updatedAt: dcs.updatedAt ? new Date(dcs.updatedAt) : new Date(),
        };
      })
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    setDocumentos(formatedPagos);
    setLoading(false);
  };

  const getInfoAlumno = async () => {
    const res = await alumnoService.getAlumno(params.id);
    setAlumno(res.data);
  };

  useEffect(() => {
    getInfoAlumno();
    loadDocumentos();
  }, []);

  if (loading)
    return (
      <div className="row">
        <div className="col-md-12 my-auto">
          <div className="spinner-grow text-primary" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      </div>
    );

  return (
    <>
      <div className="row">
        <div className="col-8">
          Fecha de entrega de documentos del alumno:{" "}
          <strong>{alumno.nombres}</strong>
          <br />
          <br />
          {documentos.length === 0 ? (
            <>
              <>No hay documentos publicados.</>
            </>
          ) : (
            <>
              <div className="table-responsive">
                <table className="table table-bordered">
                  <thead className="table-info">
                    <tr>
                      <th scope="col">F.E Balotario</th>
                      <th scope="col">F.E Certificado Medico</th>
                      <th scope="col">F.E Certificado Cofipro</th>
                      <th scope="col">F.E Carnet</th>
                      <th scope="col">F.E Guia de manejo</th>
                      <th scope="col">F.E Acta</th>
                      {userData.role === "Super Admin" ? (
                        <>
                          <th scope="col">Observación</th>
                        </>
                      ) : (
                        <></>
                      )}
                      <th scope="col">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="table-light">
                    {documentos.map((documento) => (
                      <DocumentosItem
                        documento={documento}
                        key={documento._id}
                        id={params.id}
                        loadDocumentos={loadDocumentos}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
        <div className="col-4">
          <div className="row">
            <DocumentosForm loadDocumentos={loadDocumentos} id={params.id} />
          </div>
        </div>
      </div>
    </>
  );
};

export default DocumentosList;
