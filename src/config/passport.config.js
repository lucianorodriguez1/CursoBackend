import passport from "passport";
import local from "passport-local";
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
    done(null, user[0]._id);
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
        } catch (error) {}
      }
    )
  );
};

export default initializePassport;
