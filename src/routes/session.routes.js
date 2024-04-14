import { Router } from "express";
import {auth} from "../middlewares/auth.middleware.js"
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
    if (!err) res.send("Logout ok!");
    else res.json({ status: "Logout error", body: err });
  });
});

sessionRouter.get("/login",(req, res) => {
  const { username, password } = req.query;
  console.log(username,password)
  if (username !== "pepe" || password !== "pepepass") {
    return res.send("Login Failed");
  }
  req.session.user=username;
  req.session.admin=true;

  res.send('Login success');

});
export default sessionRouter;
