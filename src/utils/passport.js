import passport from "passport";
import userModel from "../dao/mongo/models/userModel.js";
import User from "../dao/mongo/UserMongo.js";
import jwt from "passport-jwt";
import config from "../config/config.js";

const userService = new User();
const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies[config.tokenCookie];
  }
  return token;
};

const initializatePassport = () => {
  passport.use(
    "jwt",
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: config.tokenKey,
      },
      async (jwt_payload, done) => {
        try {
          return done(null, jwt_payload);
        } catch (err) {
          console.log(err);
          return done(err);
        }
      }
    )
  );

};
export default initializatePassport;
