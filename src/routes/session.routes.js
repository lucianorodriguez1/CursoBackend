import { Router } from "express";
import { auth } from "../middlewares/auth.middleware.js";
import { userManager } from "../dao/MongoDB/managers/user.js";

const sessionRouter = Router();

sessionRouter.get("/", (req, res) => {
  if (req.session.counter) {
    req.session.counter++;
    res.send(`Haz visitado la pag ${req.session.counter} veces`);
  } else {
    req.session.counter = 1;
    res.send("Bienvenido");
  }
});

sessionRouter.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (!err) {
      res.redirect("/login");
    } else {
      res.json({ status: "Logout error", body: err });
    }
  });
});

sessionRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const isUser = await userManager.getUserByEmail(email);

    if (!isUser) {
      return res.status(404).json({message:"Usuario no encontrado"});
    }
    if (email !== isUser.email || password !== isUser.password) {
      return res.send("Login Failed");
    }
    req.session.user = isUser;
    if (isUser.rol == "admin") {
      req.session.admin = true;
    } else {
      req.session.admin = false;
    }
    req.session.isLogin = true;
    res.redirect("/products");
  } catch (error) {
    console.log(error);
  }
}); 
export default sessionRouter;
