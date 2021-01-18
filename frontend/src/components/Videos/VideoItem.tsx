/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useContext, createRef } from "react";
import { findDOMNode } from "react-dom";
import ReactPlayer from "react-player";
import { useHistory } from "react-router-dom";
import { UserContext } from "../Context/UserContext";
import screenfull from "screenfull";
import * as videoService from "./videoService";
import { Video } from "./Video";
import "./VideoItem.css";
import { FaEyeSlash } from "react-icons/fa";
import { IoEyeSharp } from "react-icons/io5";

//FaEyeSlash
interface Props {
  video: Video;
  loadVideos: () => void;
  setEtapaI?: String;
  setEtapaII?: String;
  setEtapaIII?: String;
  setEtapaIV?: String;
  setEtapaTeoricos?: String;
}

const VideoItem = (props: Props) => {
  const { userData }: any = useContext(UserContext);

  const [permissionStatus, setPermissionStatus] = useState(Number);

  const {
    video,
    loadVideos,
    setEtapaI,
    setEtapaII,
    setEtapaIII,
    setEtapaIV,
    setEtapaTeoricos,
  } = props;

  const history = useHistory();

  const ref = createRef<ReactPlayer>();
  const handleScreenFull = () => {
    if (screenfull.isEnabled) {
      const element: any = findDOMNode(ref.current);
      screenfull.request(element);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await videoService.deleteVideoById(id);

      loadVideos();
    } catch (e) {
      console.log(e);
    }
  };

  const handleActivo = async (id: string) => {
    try {
      await videoService.activateVideoById(id);
      loadVideos();
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <>
      {userData.role === "Estudiante" || userData.role === "Profesor" ? (
        <>
          {video.title === setEtapaTeoricos && video.estado === 1 ? (
            <>
              <div className="col-md-6 p-2">
                <div className="card card-body video-card animate__animated animate__fadeIn">
                  <div>
                    <h5>{video.title}</h5>
                    <p>{video.description}</p>
                  </div>
                  <div>
                    <ReactPlayer
                      className="react-player"
                      ref={ref}
                      url={video.url}
                      width="100%"
                      height="50%"
                      controls={false}
                    />
                    {/**
                       * <a
                      style={{ cursor: "pointer", color: "blue" }}
                      onClick={handleScreenFull}
                    >
                      Pantalla completa
                    </a>
                       */}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <></>
          )}

          {video.title === setEtapaI && video.estado === 1 ? (
            <>
              <div className="col-md-6 p-2">
                <div className="card card-body video-card animate__animated animate__fadeIn">
                  <div>
                    <h5>{video.title}</h5>
                    <p>{video.description}</p>
                  </div>
                  <div>
                    <ReactPlayer
                      className="react-player"
                      ref={ref}
                      url={video.url}
                      width="100%"
                      height="50%"
                      controls={false}
                    />
                    {/**
                       * <a
                      style={{ cursor: "pointer", color: "blue" }}
                      onClick={handleScreenFull}
                    >
                      Pantalla completa
                    </a>
                       */}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <></>
          )}

          {video.title === setEtapaII && video.estado === 1 ? (
            <>
              <div className="col-md-6 p-2">
                <div className="card card-body video-card animate__animated animate__fadeIn">
                  <div>
                    <h5>{video.title}</h5>
                    <p>{video.description}</p>
                  </div>
                  <div>
                    <ReactPlayer
                      className="react-player"
                      ref={ref}
                      url={video.url}
                      width="100%"
                      height="50%"
                      controls={false}
                    />
                    {/**
                       * <a
                      style={{ cursor: "pointer", color: "blue" }}
                      onClick={handleScreenFull}
                    >
                      Pantalla completa
                    </a>
                       */}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <></>
          )}

          {video.title === setEtapaIII && video.estado === 1 ? (
            <>
              <div className="col-md-6 p-2">
                <div className="card card-body video-card animate__animated animate__fadeIn">
                  <div>
                    <h5>{video.title}</h5>
                    <p>{video.description}</p>
                  </div>
                  <div>
                    <ReactPlayer
                      className="react-player"
                      ref={ref}
                      url={video.url}
                      width="100%"
                      height="50%"
                      controls={false}
                    />
                    {/**
                       * <a
                      style={{ cursor: "pointer", color: "blue" }}
                      onClick={handleScreenFull}
                    >
                      Pantalla completa
                    </a>
                       */}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <></>
          )}

          {video.title === setEtapaIV && video.estado === 1 ? (
            <>
              <div className="col-md-6 p-2">
                <div className="card card-body video-card animate__animated animate__fadeIn">
                  <div>
                    <h5>{video.title}</h5>
                    <p>{video.description}</p>
                  </div>
                  <div>
                    <ReactPlayer
                      className="react-player"
                      ref={ref}
                      url={video.url}
                      width="100%"
                      height="50%"
                      controls={false}
                    />
                    {/**
                       * <a
                      style={{ cursor: "pointer", color: "blue" }}
                      onClick={handleScreenFull}
                    >
                      Pantalla completa
                    </a>
                       */}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <></>
          )}
        </>
      ) : (
        <>
          {userData.role === "Super Admin" || userData.role === "Admin" ? (
            <>
              {video.title === setEtapaTeoricos ? (
                <>
                  <div className="col-md-6 p-2">
                    <div className="card card-body video-card animate__animated animate__fadeIn">
                      <div>
                        {video.estado === 1 ? (
                          <>
                            <IoEyeSharp
                              onClick={() =>
                                video._id && handleDelete(video._id)
                              }
                              className="text-success"
                              style={{
                                fontSize: "15px",
                                cursor: "pointer",
                                float: "right",
                              }}
                            />
                          </>
                        ) : (
                          <>
                            <FaEyeSlash
                              onClick={() =>
                                video._id && handleActivo(video._id)
                              }
                              className="text-danger"
                              style={{
                                fontSize: "15px",
                                cursor: "pointer",
                                float: "right",
                              }}
                            />
                          </>
                        )}
                        <h5
                          style={{ cursor: "pointer" }}
                          onClick={() => history.push(`/videos/${video._id}`)}
                        >
                          {video.title}
                        </h5>
                        <p>{video.description}</p>
                      </div>
                      <div>
                        <ReactPlayer
                          className="react-player"
                          ref={ref}
                          url={video.url}
                          width="100%"
                          height="50%"
                          controls={false}
                        />
                        {/**
                       * <a
                      style={{ cursor: "pointer", color: "blue" }}
                      onClick={handleScreenFull}
                    >
                      Pantalla completa
                    </a>
                       */}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <></>
              )}

              {video.title === setEtapaI ? (
                <>
                  <div className="col-md-6 p-2">
                    <div className="card card-body video-card animate__animated animate__fadeIn">
                      <div>
                        {video.estado === 1 ? (
                          <>
                            <IoEyeSharp
                              onClick={() =>
                                video._id && handleDelete(video._id)
                              }
                              className="text-success"
                              style={{
                                fontSize: "15px",
                                cursor: "pointer",
                                float: "right",
                              }}
                            />
                          </>
                        ) : (
                          <>
                            <FaEyeSlash
                              onClick={() =>
                                video._id && handleActivo(video._id)
                              }
                              className="text-danger"
                              style={{
                                fontSize: "15px",
                                cursor: "pointer",
                                float: "right",
                              }}
                            />
                          </>
                        )}
                        <h5
                          style={{ cursor: "pointer" }}
                          onClick={() => history.push(`/videos/${video._id}`)}
                        >
                          {video.title}
                        </h5>
                        <p>{video.description}</p>
                      </div>
                      <div>
                        <ReactPlayer
                          className="react-player"
                          ref={ref}
                          url={video.url}
                          width="100%"
                          height="50%"
                          controls={false}
                        />
                        {/**
                       * <a
                      style={{ cursor: "pointer", color: "blue" }}
                      onClick={handleScreenFull}
                    >
                      Pantalla completa
                    </a>
                       */}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <></>
              )}

              {video.title === setEtapaII ? (
                <>
                  <div className="col-md-6 p-2">
                    <div className="card card-body video-card animate__animated animate__fadeIn">
                      <div>
                        {video.estado === 1 ? (
                          <>
                            <IoEyeSharp
                              onClick={() =>
                                video._id && handleDelete(video._id)
                              }
                              className="text-success"
                              style={{
                                fontSize: "15px",
                                cursor: "pointer",
                                float: "right",
                              }}
                            />
                          </>
                        ) : (
                          <>
                            <FaEyeSlash
                              onClick={() =>
                                video._id && handleActivo(video._id)
                              }
                              className="text-danger"
                              style={{
                                fontSize: "15px",
                                cursor: "pointer",
                                float: "right",
                              }}
                            />
                          </>
                        )}
                        <h5
                          style={{ cursor: "pointer" }}
                          onClick={() => history.push(`/videos/${video._id}`)}
                        >
                          {video.title}
                        </h5>
                        <p>{video.description}</p>
                      </div>
                      <div>
                        <ReactPlayer
                          className="react-player"
                          ref={ref}
                          url={video.url}
                          width="100%"
                          height="50%"
                          controls={false}
                        />
                        {/**
                       * <a
                      style={{ cursor: "pointer", color: "blue" }}
                      onClick={handleScreenFull}
                    >
                      Pantalla completa
                    </a>
                       */}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <></>
              )}

              {video.title === setEtapaIII ? (
                <>
                  <div className="col-md-6 p-2">
                    <div className="card card-body video-card animate__animated animate__fadeIn">
                      <div>
                        {video.estado === 1 ? (
                          <>
                            <IoEyeSharp
                              onClick={() =>
                                video._id && handleDelete(video._id)
                              }
                              className="text-success"
                              style={{
                                fontSize: "15px",
                                cursor: "pointer",
                                float: "right",
                              }}
                            />
                          </>
                        ) : (
                          <>
                            <FaEyeSlash
                              onClick={() =>
                                video._id && handleActivo(video._id)
                              }
                              className="text-danger"
                              style={{
                                fontSize: "15px",
                                cursor: "pointer",
                                float: "right",
                              }}
                            />
                          </>
                        )}
                        <h5
                          style={{ cursor: "pointer" }}
                          onClick={() => history.push(`/videos/${video._id}`)}
                        >
                          {video.title}
                        </h5>
                        <p>{video.description}</p>
                      </div>
                      <div>
                        <ReactPlayer
                          className="react-player"
                          ref={ref}
                          url={video.url}
                          width="100%"
                          height="50%"
                          controls={false}
                        />
                        {/**
                       * <a
                      style={{ cursor: "pointer", color: "blue" }}
                      onClick={handleScreenFull}
                    >
                      Pantalla completa
                    </a>
                       */}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <></>
              )}

              {video.title === setEtapaIV ? (
                <>
                  <div className="col-md-6 p-2">
                    <div className="card card-body video-card animate__animated animate__fadeIn">
                      <div>
                        {video.estado === 1 ? (
                          <>
                            <IoEyeSharp
                              onClick={() =>
                                video._id && handleDelete(video._id)
                              }
                              className="text-success"
                              style={{
                                fontSize: "15px",
                                cursor: "pointer",
                                float: "right",
                              }}
                            />
                          </>
                        ) : (
                          <>
                            <FaEyeSlash
                              onClick={() =>
                                video._id && handleActivo(video._id)
                              }
                              className="text-danger"
                              style={{
                                fontSize: "15px",
                                cursor: "pointer",
                                float: "right",
                              }}
                            />
                          </>
                        )}
                        <h5
                          style={{ cursor: "pointer" }}
                          onClick={() => history.push(`/videos/${video._id}`)}
                        >
                          {video.title}
                        </h5>
                        <p>{video.description}</p>
                      </div>
                      <div>
                        <ReactPlayer
                          className="react-player"
                          ref={ref}
                          url={video.url}
                          width="100%"
                          height="50%"
                          controls={false}
                        />
                        {/**
                       * <a
                      style={{ cursor: "pointer", color: "blue" }}
                      onClick={handleScreenFull}
                    >
                      Pantalla completa
                    </a>
                       */}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <></>
              )}
            </>
          ) : (
            <></>
          )}
        </>
      )}
    </>
  );
};

export default VideoItem;
