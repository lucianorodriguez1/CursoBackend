import { Router } from "express";
import {auth} from "../middlewares/auth.middleware.js"
import { userManager } from "../models/user.model.js";

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
    if (!err){
    res.redirect("/login");
    }else{
    
     res.json({ status: "Logout error", body: err });
    }
  });
});

sessionRouter.post("/login",async (req, res) => {
  const { email, password } = req.body;
  const isUser = await userManager.FindOne(email);
  if (email !== isUser.email || password !== isUser.password) {
    return res.send("Login Failed");
  }
  req.session.user=isUser.first_name;
  req.session.admin=false;
  req.session.isLogin=true;
  console.log(req.session)
  res.redirect('/products'); 

});
export default sessionRouter;
