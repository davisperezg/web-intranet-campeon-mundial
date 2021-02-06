import React, {
  ChangeEvent,
  useContext,
  FormEvent,
  useEffect,
  useState,
} from "react";
import { useHistory, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import * as videoService from "./videoService";
import { Video } from "./Video";
import { GoArrowLeft } from "react-icons/go";
import MostarSesionTerminada from "../lib/SesionTerminada";
import { UserContext } from "../Context/UserContext";

type InputChange = ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;
type SelectChange = ChangeEvent<HTMLSelectElement>;

interface Params {
  id?: string;
}

const VideoForm = () => {
  const initialState = {
    title: "TEORICOS",
    description: "",
    url: "",
  };

  const [video, setVideo] = useState<Video>(initialState);
  const { userData, setUserData }: any = useContext(UserContext);

  const history = useHistory();
  const params = useParams<Params>();

  const getVideo = async (id: string) => {
    const res = await videoService.getVideoById(id);
    const { title, description, url } = res.data;
    setVideo({ title, description, url });
  };

  useEffect(() => {
    if (params.id) getVideo(params.id);
  }, [params.id]);

  const handleInputChange = (e: InputChange) =>
    setVideo({ ...video, [e.target.name]: e.target.value });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!params.id) {
      try {
        await videoService.createNewVideo(video);
        setVideo(initialState);
        toast.success("Video añadido");
        history.push("/");
      } catch (e) {
        toast.error(JSON.parse(e.request.response).message);
      }
    } else {
      try {
        await videoService.updateVideo(params.id, video);
        history.push("/");
      } catch (e) {
        console.log(e);
      }
    }
  };
  const handleSelectChange = async (e: SelectChange) => {
    setVideo({
      ...video,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="row">
      <div className="col-md-4 offset-md-4">
        <div className="card my-auto">
          <GoArrowLeft
            onClick={() => {
              history.push("/");
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
            <h3>Video</h3>
            <form onSubmit={handleSubmit}>
              {params.id ? (
                <></>
              ) : (
                <>
                  <div className="form-group">
                    <select
                      name="title"
                      onChange={handleSelectChange}
                      className="custom-select"
                      //disabled={}
                      value={video.title}
                      //defaultValue={"NOSELECT"}
                    >
                      <option value="TEORICOS">TEORICOS</option>
                      <option value="ETAPA I">ETAPA I</option>
                      <option value="ETAPA II">ETAPA II</option>
                      <option value="ETAPA III">ETAPA III</option>
                      <option value="ETAPA IV">ETAPA IV</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      name="url"
                      placeholder="https://somesite.com"
                      className="form-control"
                      onChange={handleInputChange}
                      value={video.url}
                    />
                  </div>
                </>
              )}

              <div className="form-group">
                <textarea
                  name="description"
                  rows={3}
                  className="form-control"
                  placeholder="Descripción"
                  onChange={handleInputChange}
                  value={video.description}
                ></textarea>
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
  );
};

export default VideoForm;
