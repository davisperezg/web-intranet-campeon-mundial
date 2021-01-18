import { Response, RequestHandler } from "express";
import Video from "../models/Video";

export const createVideo: RequestHandler = async (req, res) => {
  const videoFound = await Video.findOne({ url: req.body.url });

  if (videoFound)
    return res
      .status(303)
      .json({ message: "No puede añadir un video porque el URL ya existe." });

  const { title, description, url } = req.body;
  const newVideo = new Video({
    title,
    description,
    url,
    estado: 1,
  });
  const savedVideo = await newVideo.save();
  res.json(savedVideo);
};

export const getVideos: RequestHandler = async (req, res) => {
  try {
    const videos = await Video.find();
    return res.json(videos);
  } catch (error) {
    res.json(error);
  }
};

export const getVideo: RequestHandler = async (req, res) => {
  const videoFound = await Video.findById(req.params.id);

  if (!videoFound) return res.status(204).json();

  return res.json(videoFound);
};

export const deleteVideo: RequestHandler = async (req, res) => {
  const dataUpdated = {
    estado: 2,
  };

  const videoFound = await Video.findByIdAndUpdate(req.params.id, dataUpdated, {
    new: true,
  });

  if (!videoFound) return res.status(204).json();

  return res.status(204).json(videoFound);
};

export const updateVideo: RequestHandler = async (
  req,
  res
): Promise<Response> => {
  const videoUpdated = await Video.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!videoUpdated) return res.status(204).json();
  return res.json(videoUpdated);
};

export const habilitarVideo: RequestHandler = async (
  req,
  res
): Promise<Response> => {
  const dataUpdated = {
    estado: 1,
  };
  const videoUpdated = await Video.findByIdAndUpdate(
    req.params.id,
    dataUpdated,
    {
      new: true,
    }
  );
  if (!videoUpdated) return res.status(204).json();
  return res.json(videoUpdated);
};
