import React, {
  ChangeEvent,
  useEffect,
  useContext,
  FormEvent,
  useState,
} from "react";
import { GoArrowLeft } from "react-icons/go";
import { Egresos } from "./Egresos";
import * as egresoService from "./EgresoSerivce";
import { useHistory, useParams } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert"; // Import
import { toast } from "react-toastify";
import { UserContext } from "../Context/UserContext";
import MostarSesionTerminada from "../lib/SesionTerminada";

type InputChange = ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;

const EgresoForm = () => {
  const { userData }: any = useContext(UserContext);
  const initialState = {
    detalle: "",
    cantidad: 0,
    registrador: userData.id,
  };

  const [egreso, setEgreso] = useState<Egresos>(initialState);
  const history = useHistory();

  const handleSubmit = async () => {
    //e.preventDefault();
    try {
      await egresoService.createNewEgreso(egreso);
      toast.success("Egreso añadido");
      setEgreso(initialState);
    } catch (e) {
      console.log(e);
      toast.error(JSON.parse(e.request.response).message);
    }
  };

  const handleInputChange = (e: InputChange) =>
    setEgreso({ ...egreso, [e.target.name]: e.target.value });

  const modalComfirmarRegistro = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    confirmAlert({
      title: "Mensaje",
      message: "Esta seguro que desea registrar el egreso ?",
      buttons: [
        {
          label: "Si",
          onClick: () => {
            handleSubmit();
          },
        },
        {
          label: "No",
          onClick: () => {},
        },
      ],
    });
  };
  //no ingresar egreso
  useEffect(() => {
    setEgreso({ ...egreso, registrador: userData.id });
  }, [userData.id]);

  return (
    <>
      <div className="row">
        <div className="col-md-4 offset-md-4">
          <div className="card my-auto">
            <GoArrowLeft
              onClick={() => {
                history.push("/egreso");
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
              <h3>Egreso</h3>
              <form onSubmit={modalComfirmarRegistro}>
                <div className="form-group">
                  <input
                    type="text"
                    name="cantidad"
                    placeholder="Cantidad"
                    className="form-control"
                    onChange={handleInputChange}
                    value={egreso.cantidad}
                  />
                </div>

                <div className="form-group">
                  <textarea
                    name="detalle"
                    rows={3}
                    className="form-control"
                    placeholder="Descripción"
                    onChange={handleInputChange}
                    value={egreso.detalle}
                  ></textarea>
                </div>

                <button className="btn btn-primary" style={{ width: "100%" }}>
                  Guardar
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EgresoForm;
