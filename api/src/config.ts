import { config } from "dotenv";

config();

export default {
  MONGO_DATABASE: process.env.MONGO_DATABASE || "videosdb",
  MONGO_USER: process.env.MONGO_USER || "",
  MONGO_PASSWORD: process.env.MONGO_PASSWORD || "",
  MONGO_HOST: process.env.MONGO_HOST || "localhost",
  SECRET_KEY: process.env.SECRET_KEY || "TOKEN_DEV",
  EXPIRE_KEY: process.env.EXPIRE_KEY || "1d",
  DEFECTO_ROLE: process.env.DEFECTO_ROLE || "Admin",
  DEFECTO_SEDE: process.env.DEFECTO_SEDE || "Huacho",
};
