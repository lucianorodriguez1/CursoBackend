import { Router } from "express";
import passport from "passport";
import { authToken, generateToken } from "../utils/jwt.js";
import { passportCall } from "../utils/passport.js";
import { authorization } from "../middlewares/auth.middleware.js";
import { userManager } from "../dao/MongoDB/managers/user.dao.js";
import { createHash, isValidPassword } from "../utils/bcrypt.js";

const sessionRouter = Router();

sessionRouter.get("/logout", (req, res) => {
  res.clearCookie("coderCookieToken");
  res.redirect("/");
});
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
sessionRouter.post("/register", async (req, res) => {
  try {
    const { first_name, last_name, age, email, password } = req.body;
    const passwordHash = createHash(password);
    const newUser = await userManager.createUser({
      first_name,
      last_name,
      age,
      email,
      password: passwordHash,
    });
    const token = generateToken(newUser);
    res
      .cookie("coderCookieToken", token, {
        maxAgre: 60 * 60 * 1000,
        httpOnly: true,
      })
      .redirect("/");
  } catch (error) {
    console.log(error);
  }
});
sessionRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userManager.getUserByEmail(email);
    if (!user)
      return res
        .status(401)
        .json({ status: "succes", message: "credenciales incorrectas" });
    const validatePassword = isValidPassword(user, password);
    if (!validatePassword)
      return res
        .status(403)
        .json({ status: "succes", message: "credenciales incorrectas" });

    const token = generateToken(user);
    res
      .cookie("coderCookieToken", token, {
        maxAgre: 60 * 60 * 1000,
        httpOnly: true,
      })
      .redirect("/");
  } catch (error) {
    console.log(error);
  }
});
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
