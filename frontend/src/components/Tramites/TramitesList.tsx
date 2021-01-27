import React, { useState, useEffect, useContext } from "react";
import { Tramites } from "./Tramites";
import * as tramiteService from "./TramiteService";
import TramitesItem from "./TramitesItem";
import { useHistory } from "react-router-dom";
import MostarSesionTerminada from "./../lib/SesionTerminada";
import { UserContext } from "../Context/UserContext";

const TramiteList = () => {
  const [loading, setLoading] = useState(true);
  const history = useHistory();
  const { userData, setUserData }: any = useContext(UserContext);

  const [tramites, setTramites] = useState<Tramites[]>([]);
  const loadSedes = async () => {
    try {
      const res = await tramiteService.getTramites();
      setLoading(false);
      setTramites(res.data);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    loadSedes();
  }, []);

  if (userData.state === false) {
    return <MostarSesionTerminada />;
  }

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

  if (tramites.length === 0) return <div>No hay tramites publicados.</div>;

  return (
    <>
      <div className="row">
        <div className="col-sm-12">
          <div className="card">
            <div className="card-header">
              Tramites
              <a
                style={{ float: "right", color: "blue", cursor: "pointer" }}
                onClick={() => {
                  history.push("/tramites/registro");
                }}
              >
                Añadir tramite
              </a>
            </div>
            <div className="card-body">
              <br />
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th scope="col" style={{ textAlign: "left" }}>
                      Tramite
                    </th>
                    <th scope="col">Costo</th>
                    <th scope="col">Fecha Creada</th>
                    <th scope="col">Fecha Actualizada</th>
                    <th scope="col">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {tramites.map((tramite) => (
                    <TramitesItem sede={tramite} key={tramite._id} />
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
export default TramiteList;
