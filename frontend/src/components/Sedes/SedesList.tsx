import React, { useState, useContext, useEffect } from "react";
import { Sedes } from "./Sedes";
import * as SedesService from "./SedesService";
import SedesItem from "./SedesItem";
import MostarSesionTerminada from "./../lib/SesionTerminada";
import { UserContext } from "../Context/UserContext";

const SedesList = () => {
  const [loading, setLoading] = useState(true);
  const { userData, setUserData }: any = useContext(UserContext);

  const [sedes, setSedes] = useState<Sedes[]>([]);
  const loadSedes = async () => {
    try {
      const res = await SedesService.getSedes();
      setLoading(false);
      setSedes(res.data);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    loadSedes();
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

  if (sedes.length === 0) return <div>No hay sedes publicados.</div>;

  return (
    <>
      <div className="row">
        <div className="col-sm-12">
          <div className="card">
            <div className="card-header"> Sedes</div>
            <div className="card-body">
              <br />
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th scope="col">Sede</th>
                    <th scope="col">Sequencia Nro</th>
                    <th scope="col">Fecha Creada</th>
                    <th scope="col">Fecha Actualizada</th>
                    <th scope="col">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {sedes.map((sede) => (
                    <SedesItem sede={sede} key={sede._id} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default SedesList;
