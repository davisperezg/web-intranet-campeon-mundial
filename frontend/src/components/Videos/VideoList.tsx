import React, { useContext, useEffect, useState } from "react";
import * as videoService from "./videoService";

import { Video } from "./Video";
import VideoItem from "./VideoItem";
import { useHistory } from "react-router-dom";
import { UserContext } from "../Context/UserContext";
import { IoLogoWhatsapp } from "react-icons/io";
import { GoArrowLeft } from "react-icons/go";
import MostarSesionTerminada from "./../lib/SesionTerminada";

interface Props {
  //setAvtivateVideos: (statud: boolean) => void;
  setEtapaI?: (statud: String) => void;
  setEtapaII?: (statud: String) => void;
  setEtapaIII?: (statud: String) => void;
  setEtapaIV?: (statud: String) => void;
  setEtapaTeoricos?: (statud: String) => void;
}

const VideoList = (props: Props) => {
  const {
    setEtapaI,
    setEtapaII,
    setEtapaIII,
    setEtapaIV,
    setEtapaTeoricos,
  }: any = props;
  const history = useHistory();

  const [loading, setLoading] = useState(true);

  const [videos, setVideos] = useState<Video[]>([]);

  const { userData }: any = useContext(UserContext);

  const loadVideos = async () => {
    try {
      const res = await videoService.getVideos();
      const formatedVideos = res.data;
      /*.map((video) => {
          return {
            ...video,
            createdAt: video.createdAt ? new Date(video.createdAt) : new Date(),
            updatedAt: video.updatedAt ? new Date(video.updatedAt) : new Date(),
          };
        })
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
         * 
         */
      setVideos(formatedVideos);
      setLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    loadVideos();
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

  if (videos.length === 0)
    return (
      <div>
        No hay videos publicados.{" "}
        <a
          onClick={() => history.push("/videos")}
          style={{ color: "blue", cursor: "pointer" }}
        >
          Añada nuevo videos aqui
        </a>
      </div>
    );

  return (
    <>
      <div className="row">
        {videos.map((video) => (
          <VideoItem
            video={video}
            key={video._id}
            loadVideos={loadVideos}
            setEtapaI={setEtapaI}
            setEtapaII={setEtapaII}
            setEtapaIII={setEtapaIII}
            setEtapaIV={setEtapaIV}
            setEtapaTeoricos={setEtapaTeoricos}
          />
        ))}
      </div>
    </>
  );
};

export default VideoList;
