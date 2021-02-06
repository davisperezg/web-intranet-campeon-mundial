import React, {
  ChangeEvent,
  useState,
  useContext,
  useEffect,
  FormEvent,
} from "react";
import { useHistory, useParams } from "react-router-dom";
import { GoArrowLeft } from "react-icons/go";
import { Tramites } from "./Tramites";
import * as tramitesService from "./TramiteService";
import { toast } from "react-toastify";
import MostarSesionTerminada from "./../lib/SesionTerminada";
import { UserContext } from "../Context/UserContext";

type InputChange = ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;

interface Params {
  id?: string;
}

const TramiteForm = () => {
  const initialState = {
    name: "",
    costo: "",
  };
  const [tramite, setTramite]: any = useState<Tramites>(initialState);
  const { userData, setUserData }: any = useContext(UserContext);

  const history = useHistory();
  const params: any = useParams<Params>();
  const getTramite = async (id: string) => {
    try {
      const res = await tramitesService.getTramiteById(id);
      setTramite(res.data);
    } catch (e) {
      console.log(e);
    }
  };
  const handleInputChange = (e: InputChange) =>
    setTramite({ ...tramite, [e.target.name]: e.target.value });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!params.id) {
      try {
        await tramitesService.createNewTramite(tramite);
        setTramite(initialState);
        toast.success("Video añadido");
        history.push("/tramites");
      } catch (e) {
        console.log(e);
        toast.error(JSON.parse(e.request.response).message);
      }
    } else {
      try {
        await tramitesService.updateTramite(params.id, tramite);
        history.push("/tramites");
      } catch (e) {
        console.log(e);
      }
    }
  };
  useEffect(() => {
    if (params.id) getTramite(params.id);
  }, [params.id]);

  return (
    <>
      <div className="row">
        <div className="col-md-6 offset-md-4">
          <div className="card my-auto">
            <GoArrowLeft
              onClick={() => {
                history.push("/tramites");
              }}
              className="my-2"
              style={{
                cursor: "pointer",
                fontSize: "20px",
                position: "absolute",
                marginLeft: "90%",
              }}
            />
            <div className="card-body">
              <h3>TRAMITE {params.id ? tramite.name : ""}</h3>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <input
                    type="text"
                    name="name"
                    placeholder="Tramite"
                    className="form-control"
                    autoFocus
                    onChange={handleInputChange}
                    value={tramite.name}
                  />
                </div>

                <div className="form-group">
                  <input
                    type="text"
                    name="costo"
                    placeholder="Costo"
                    className="form-control"
                    onChange={handleInputChange}
                    value={tramite.costo}
                  />
                </div>

                {params.id ? (
                  <button className="btn btn-info" style={{ width: "100%" }}>
                    Actualizar
                  </button>
                ) : (
                  <button className="btn btn-primary" style={{ width: "100%" }}>
                    Guardar
                  </button>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TramiteForm;
