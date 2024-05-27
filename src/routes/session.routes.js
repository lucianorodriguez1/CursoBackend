import { Router } from "express";
import passport from "passport";
import { passportCall } from "../middlewares/passport.middleware.js";
import { authorization } from "../middlewares/auth.middleware.js";
import { register, logout, login } from "../controllers/session.controllers.js";

const sessionRouter = Router();

sessionRouter.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
  async (req, res) => {}
);
sessionRouter.get(
  "/githubcallback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  async (req, res) => {
    req.session.user = req.user;
    req.session.isLogin = true;
    res.redirect("/");
  }
);
sessionRouter.post("/register", register);
sessionRouter.post("/login", login);
sessionRouter.get("/logout", logout);
sessionRouter.get(
  "/current",
  passportCall("jwt"),
  authorization("user"),
  (req, res) => {
    res.send(req.user);
  }
);

export default sessionRouter;
