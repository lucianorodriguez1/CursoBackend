import passport from "passport";
import GitHubStrategy from "passport-github2";
import userModel from "../dao/MongoDB/models/user.model.js";
import { userManager } from "../dao/MongoDB/managers/user.dao.js";
import jwt from "passport-jwt";
import config from "../config/config.js";

const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["coderCookieToken"];
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
  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: config.clientIdGitHub,
        clientSecret: config.clienteSecretsGitHub,
        callbackURL: "http://localhost:8080/api/sessions/githubcallback",
      },
      async (accesToken, refreshToken, profile, done) => {
        try {
          let user = await userManager.getUserByEmail(profile.profileUrl);
          if (!user) {
            let newUser = {
              first_name: profile.username,
              last_name: " ",
              age: 20,
              email: profile.profileUrl,
              password: " ",
            };
            let result = await userManager.createUser(newUser);
            done(null, result);
          } else {
            done(null, user);
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );
  passport.serializeUser((user, done) => {
    if (Array.isArray(user)) {
      done(null, user[0]._id);
    } else {
      done(null, user._id);
    }
  });
  passport.deserializeUser(async (id, done) => {
    let user = await userModel.findById(id);
    done(null, user);
  });
};
export default initializatePassport;
