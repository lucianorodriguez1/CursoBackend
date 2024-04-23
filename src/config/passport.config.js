import passport from "passport";
import local from "passport-local";
import GitHubStrategy from "passport-github2";
import userModel from "../dao/MongoDB/models/user.model.js";
import { userManager } from "../dao/MongoDB/managers/user.dao.js";
import { createHash, isValidPassword } from "../utils/bcrypt.js";

const LocalStrategy = local.Strategy;
const initializePassport = () => {
  passport.use(
    "register",
    new LocalStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body;

        try {
          let user = await userManager.getUserByEmail(username);
          if (user) {
            console.log("User already exists");
            return done(null, false);
          }
          const newUser = {
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
          };
          let result = await userManager.createUser(newUser);
          return done(null, result);
        } catch (error) {
          return done("Error al obtener usuario: " + error);
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

  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email" },
      async (username, password, done) => {
        try {
          const user = await userManager.getUserByEmail(username);
          if (!user) {
            console.log("User doesn't exist");
            return done(null, false);
          }
          if (!isValidPassword(user, password)) return done(null, false);
          return done(null, user);
        } catch (error) {
          console.log(error)
        }
      }
    )
  );

  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: "Iv1.20882f0a0e059dfa",
        clientSecret: "8bcfd5288971cb2f582409a0019130736e8b7230",
        callbackURL: "http://localhost:8080/api/sessions/githubcallback",
      },
      async (accesToken, refreshToken, profile, done) => {
        try {
          //console.log(profile);
          let user = await userManager.getUserByEmail(profile.profileUrl);
          if (!user) {
            let newUser = {
              first_name: profile.username,
              last_name: " ",
              age: 0,
              email: profile.profileUrl,
              password: " ",
            };
            console.log(profile);
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

  // passport.serializeUser((user, done) => {
  //   console.log(user);
  //   done(null, user._id);
  // });
  // passport.deserializeUser(async (id, done) => {
  //   let user = await userModel.findById(id);
  //   done(null, user);
  // });
};
export default initializePassport;
