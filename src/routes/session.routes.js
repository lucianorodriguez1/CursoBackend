import { Router } from "express";
import passport from "passport";
import { passportCall } from "../utils/passport.js";
import { authorization } from "../middlewares/auth.middleware.js";
import { register,logout, login } from "../controllers/session.controllers.js";

const sessionRouter = Router();

//desafio local
/*
// sessionRouter.post(
//   "/login",
//   passport.authenticate("login", {
//     failureRedirect: "/api/sessions/faillogin",
//   }),
//   async (req, res) => {
//     if (!req.user)
//       return res
//         .status(400)
//         .send({ status: "error", error: "Invalid credentials" });
//     req.session.user = {
//       first_name: req.user.first_name,
//       last_name: req.user.last_name,
//       age: req.user.age,
//       email: req.user.email,
//     };
//     req.session.isLogin = true;
//     res.redirect("/");
//   }
// );



// sessionRouter.get("/faillogin", (req, res) => {
//   res.send({ error: "Failed login" });
// });
// sessionRouter.post(
//   "/register",
//   passport.authenticate("register", {
//     failureRedirect: "/api/sessions/failRegister",
//   }),
//   async (req, res) => {
//     res.redirect("/login");
//   }
// );
// sessionRouter.get("/failRegister", async (req, res) => {
//   console.log("Failed Strategy");
//   res.send({ error: "Failed" });
// });

*/
//FIN DESAFIO LOCAL
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
sessionRouter.post("/register",register);
sessionRouter.post("/login",login);
sessionRouter.get("/logout", logout);
//¿Esto seria como un ejemplo??
sessionRouter.get(
  "/current",
  passportCall("jwt"),
  authorization("user"),
  (req, res) => {
    res.send(req.user);
  }
);

export default sessionRouter;
