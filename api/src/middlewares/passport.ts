import { Strategy, ExtractJwt, StrategyOptions } from "passport-jwt";
import Users from "../models/Users";
import config from "../config";

const opts: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.SECRET_KEY,
};

export default new Strategy(opts, async (payload, done) => {
  //console.log(payload);
  const userFound: any = await Users.findOne({
    _id: payload.id,
  }).populate("roles");
  //console.log(userFound);
  const data = {
    id: userFound._id,
    username: userFound.username,
    nombres: userFound.nombres,
    //email: userFound.email,
    role: userFound.roles[0].name,
    nivel: userFound.nivel,
    estado: userFound.estado,
  };

  //console.log(data);
  try {
    if (userFound) {
      return done(null, data);
    }
    done(null, false);
  } catch (e) {
    console.log(e);
  }
});
