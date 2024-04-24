import { Router } from "express";
import passport from "passport";

const sessionRouter = Router();

sessionRouter.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (!err) {
      res.redirect("/login");
    } else {
      res.json({ status: "Logout error", body: err });
    }
  });
});

sessionRouter.post(
  "/login",
  passport.authenticate("login", {
    failureRedirect: "/api/sessions/faillogin",
  }),
  async (req, res) => {
    if (!req.user)
      return res
        .status(400)
        .send({ status: "error", error: "Invalid credentials" });
    req.session.user = {
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      age: req.user.age,
      email: req.user.email,
    };
    req.session.isLogin = true;
    res.redirect("/");
  }
);
sessionRouter.get("/faillogin", (req, res) => {
  res.send({ error: "Failed login" });
});
sessionRouter.post(
  "/register",
  passport.authenticate("register", {
    failureRedirect: "/api/sessions/failRegister",
  }),
  async (req, res) => {
    res.redirect("/login");
  }
);
sessionRouter.get("/failRegister", async (req, res) => {
  console.log("Failed Strategy");
  res.send({ error: "Failed" });
});

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
    console.log(req.user);
    req.session.isLogin = true;
    res.redirect("/");
  }
);

/* JSON WEB SOCKETS**************************************
//import { authToken, generateToken } from "../utils/jwt.js"; //JSON WEB TOKEN
let users = [];
sessionRouter.post("register", async (req, res) => {
  try {
    const { first_name, last_name, age, email, password } = req.body;
    let newUser;
    const exists = users.find((u) => u.email === email);
    if (exists)
      return res
        .status(400)
        .send({ status: "error", message: "Usuario ya existe" });
    if (email == "adminCoder@coder.com" && password == "adminCod3r123") {
      newUser = await userManager.createUser({
        first_name,
        last_name,
        age,
        email,
        password: createHash(password),
        rol: "admin",
      });
    } else {
      newUser = await userManager.createUser({
        first_name,
        last_name,
        age,
        email,
        password: createHash(password),
      });
    }
    const acces_token = generateToken(newUser);
    res
      .status(201)
      .json({ status: "succes", data: newUser, token: acces_token });
  } catch (error) {
    console.log(error);
  }
});

sessionRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const isUser = await userManager.getUserByEmail(email);

    if (!isUser) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    if (!isValidPassword(isUser, password)) {
      return res.send("Login Failed. password incorrect");
    }

    delete isUser.password;
    req.session.user = isUser;
    if (isUser.rol == "admin") {
      req.session.admin = true;
    } else {
      req.session.admin = false;
    }
    req.session.isLogin = true;
    const acces_token = generateToken(newUser);
    console.log("Token: " + acces_token);
    res.redirect("/products");
  } catch (error) {
    console.log(error);
  }
});

sessionRouter.get('/current',authToken,(req,res)=>{
  res.send({status:"succes",payload:req.user});
})

****************  FIN JWT         ***************/
export default sessionRouter;
