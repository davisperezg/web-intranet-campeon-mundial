import React, {
  useContext,
  ChangeEvent,
  useState,
  useEffect,
  FormEvent,
} from "react";
import { useHistory, useParams } from "react-router-dom";
import * as SedesService from "./SedesService";
import { Sedes } from "./Sedes";
import { toast } from "react-toastify";
import { GoArrowLeft } from "react-icons/go";
import { UserContext } from "../Context/UserContext";
import MostarSesionTerminada from "../lib/SesionTerminada";

type InputChange = ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;

interface Params {
  id?: string;
}

const SedesForm = () => {
  const initialState = {
    seq: "",
  };
  const { userData, setUserData }: any = useContext(UserContext);

  const [sede, setSede]: any = useState<Sedes>(initialState);
  const history = useHistory();
  const params: any = useParams<Params>();
  const getSede = async (id: string) => {
    const res = await SedesService.getSedesById(id);
    setSede(res.data);
  };

  const handleInputChange = (e: InputChange) =>
    setSede({ ...sede, [e.target.name]: e.target.value });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await SedesService.updateSedes(params.id, sede);
      history.push("/sedes");
    } catch (e) {
      toast.error(JSON.parse(e.request.response).message);
    }
  };

  useEffect(() => {
    if (params.id) getSede(params.id);
  }, [params.id]);

  return (
    <>
      <div className="row">
        <div className="col-md-4 offset-md-4">
          <div className="card my-auto">
            <GoArrowLeft
              onClick={() => {
                history.push("/sedes");
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
              <h3>Sede {sede.name}</h3>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <input
                    type="text"
                    name="seq"
                    placeholder="Secuencia"
                    className="form-control"
                    autoFocus
                    onChange={handleInputChange}
                    value={sede.seq}
                  />
                </div>

                <button style={{ width: "100%" }} className="btn btn-info">
                  Actualizar
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SedesForm;
