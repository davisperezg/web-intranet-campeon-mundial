import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { Pagos } from "./Pagos";
import * as pagosService from "./PagosService";
import PagosItem from "./PagosItem";
import PagosForm from "./PagosForm";
import * as alumnoService from "../Alumnos/AlumnoService";
import { UserContext } from "../Context/UserContext";
import { PagoProvider } from "../Context/PagoContext";
import MostarSesionTerminada from "./../lib/SesionTerminada";

interface Params {
  id?: string;
  idpago?: string;
}
const PagosList = () => {
  const [fin, setFin] = useState<Boolean>(false);

  const params: any = useParams<Params>();
  const { userData }: any = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [pagos, setPagos] = useState<Pagos[]>([]);
  const [alumno, setAlumno] = useState<any>({});
  const [edit, setEdit] = useState({
    value: false,
  });

  const loadPagos = async () => {
    try {
      const res = await pagosService.getPagos(params.id);
      const formatedPagos = res.data
        .map((pagos) => {
          return {
            ...pagos,
            createdAt: pagos.createdAt ? new Date(pagos.createdAt) : new Date(),
            updatedAt: pagos.updatedAt ? new Date(pagos.updatedAt) : new Date(),
          };
        })
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      setPagos(formatedPagos);
      setLoading(false);
    } catch (e) {
      setLoading(false);
      setFin(true);
    }
  };

  const getInfoAlumno = async () => {
    const res = await alumnoService.getAlumno(params.id);
    setAlumno(res.data);
  };
  useEffect(() => {
    getInfoAlumno();
    loadPagos();
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

  //if (pagos.length === 0) return <div>No hay pagos publicados.</div>;

  return (
    <>
      <PagoProvider value={{ edit, setEdit }}>
        <div className="row">
          <div className="col-12">
            Pagos del alumno: <strong>{alumno.nombres}</strong>
            <br />
            <br />
            {pagos.length === 0 ? (
              <>
                No hay pagos publicados.
                <br /> <br />
              </>
            ) : (
              <>
                <div className="table-responsive">
                  <table className="table table-bordered">
                    <thead className="table-warning">
                      <tr>
                        <th scope="col">Tramite</th>
                        <th scope="col">Cant</th>
                        <th scope="col">P.U</th>
                        <th scope="col">Total</th>
                        <th scope="col">Pago</th>
                        <th scope="col">Resta</th>
                        <th scope="col">Nro Recibo</th>
                        <th scope="col">Fecha</th>
                        <th scope="col">Registrador</th>
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
                      {pagos.map((pago) => (
                        <PagosItem
                          pago={pago}
                          key={pago._id}
                          id={params.id}
                          loadPagos={loadPagos}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
          <div className="col-12">
            <div className="row">
              <PagosForm loadPagos={loadPagos} id={params.id} />
            </div>
          </div>
        </div>
      </PagoProvider>
    </>
  );
};

export default PagosList;
