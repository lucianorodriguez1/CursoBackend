import { Router } from "express";
import passport from "passport";
import { passportCall } from "../../middlewares/passport.middleware.js";
import { sessions } from "../../controllers/index.js";

const sessionRouter = Router();

/*
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
*/
sessionRouter.post("/register", sessions.register);
sessionRouter.post("/login", sessions.login);
sessionRouter.get("/logout", sessions.logout);
sessionRouter.get("/current", passportCall("jwt"), sessions.current);

export default sessionRouter;
