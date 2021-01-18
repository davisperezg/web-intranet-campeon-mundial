import React, { useContext, useEffect, useState } from "react";

import { useHistory } from "react-router-dom";
import { UserContext } from "../Context/UserContext";
import { IoLogoWhatsapp } from "react-icons/io";
import VideoList from "../Videos/VideoList";
import { GoArrowLeft } from "react-icons/go";

const Principal = () => {
  const [isActivateVideos, setAvtivateVideos] = useState<Boolean>(true);

  const history = useHistory();
  const { userData }: any = useContext(UserContext);
  const [isEtapaI, setEtapaI] = useState<any>("");
  const [isEtapaII, setEtapaII] = useState<any>("");
  const [isEtapaIII, setEtapaIII] = useState<any>("");
  const [isEtapaIV, setEtapaIV] = useState<any>("");
  const [isEtapaTeoricos, setIsEtapaTeoricos] = useState<any>("");

  const [isShowRegresar, setShowRegresar] = useState<Boolean>(false);

  return (
    <>
      <>
        {isShowRegresar ? (
          <>
            <div className="row">
              <div className="col-sm-12">
                <a
                  style={{
                    color: "blue",
                    float: "right",
                    cursor: "pointer",
                    fontSize: "15px",
                  }}
                  onClick={() => {
                    setAvtivateVideos(true);
                    setEtapaI("");
                    setEtapaII("");
                    setEtapaIII("");
                    setEtapaIV("");
                    setIsEtapaTeoricos("");
                    setShowRegresar(false);
                  }}
                >
                  <GoArrowLeft /> {"  "}Regresar al menu principal
                </a>
              </div>
            </div>
            <br />
          </>
        ) : (
          <></>
        )}
      </>
      {isActivateVideos ? (
        <>
          <div className="row">
            <div className="col-sm-12">
              Bienvenido: {userData.nombres}
              <br /> Videos de clases
            </div>

            <div className="col-sm-6">
              <ul>
                <li className="nav-item">
                  <a
                    style={{ cursor: "pointer", color: "blue" }}
                    onClick={() => {
                      setAvtivateVideos(false);
                      setIsEtapaTeoricos("TEORICOS");
                      setShowRegresar(true);
                    }}
                  >
                    Clases Teoría
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    style={{ cursor: "pointer", color: "blue" }}
                    onClick={() => {
                      setAvtivateVideos(false);
                      setEtapaI("ETAPA I");
                      setShowRegresar(true);
                    }}
                  >
                    Etapa I
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    style={{ cursor: "pointer", color: "blue" }}
                    onClick={() => {
                      setAvtivateVideos(false);
                      setEtapaII("ETAPA II");
                      setShowRegresar(true);
                    }}
                  >
                    Etapa II
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    style={{ cursor: "pointer", color: "blue" }}
                    onClick={() => {
                      setAvtivateVideos(false);
                      setEtapaIII("ETAPA III");
                      setShowRegresar(true);
                    }}
                  >
                    Etapa III
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    style={{ cursor: "pointer", color: "blue" }}
                    onClick={() => {
                      setAvtivateVideos(false);
                      setEtapaIV("ETAPA IV");
                      setShowRegresar(true);
                    }}
                  >
                    Etapa IV
                  </a>
                </li>
              </ul>
            </div>

            <div className="col-sm-6">
              <p style={{ float: "right" }}>
                Reserve su exámen médico para obtener tu licencia. <br />
                Clinica Medic Center:{" "}
                <a
                  target="_blank"
                  href="https://api.whatsapp.com/send?phone=51966661784&text=Quiero%20reservar%20ex%C3%A1men%20m%C3%A9dico."
                >
                  {" "}
                  <IoLogoWhatsapp className="text-success" /> +51966661784
                </a>
              </p>
            </div>
            <div className="col-sm-8" style={{ top: "300px" }}>
              Simulacro de preguntas para la evaluación de conocimientos en la
              conducción para postulantes a licencias de conducir.
              <a
                //type="button"
                className="text-danger"
                target="_blank"
                href="https://sierdgtt.mtc.gob.pe/"
              >
                {" "}
                <strong>IR A SIMULACRO</strong>
              </a>
            </div>
          </div>
        </>
      ) : (
        <>
          {isEtapaI === "ETAPA I" ? (
            <>
              <VideoList key={""} setEtapaI={isEtapaI} />
            </>
          ) : (
            <></>
          )}
          <>
            {isEtapaII === "ETAPA II" ? (
              <>
                <VideoList key={""} setEtapaII={isEtapaII} />
              </>
            ) : (
              <></>
            )}
          </>
          <>
            {isEtapaIII === "ETAPA III" ? (
              <>
                <VideoList key={""} setEtapaIII={isEtapaIII} />
              </>
            ) : (
              <></>
            )}
          </>
          <>
            {isEtapaIV === "ETAPA IV" ? (
              <>
                <VideoList key={""} setEtapaIV={isEtapaIV} />
              </>
            ) : (
              <></>
            )}
          </>
          <>
            {isEtapaTeoricos === "TEORICOS" ? (
              <>
                <VideoList key={""} setEtapaTeoricos={isEtapaTeoricos} />
              </>
            ) : (
              <></>
            )}
          </>
        </>
      )}
    </>
  );
};

export default Principal;
