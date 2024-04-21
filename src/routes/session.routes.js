import { Router } from "express";
import { auth } from "../middlewares/auth.middleware.js";
import { userManager } from "../dao/MongoDB/managers/user.dao.js";
import { isValidPassword } from "../utils/bcrypt.js";
import passport from "passport";

const sessionRouter = Router();

// sessionRouter.get("/", (req, res) => {
//   if (req.session.counter) {
//     req.session.counter++;
//     res.send(`Haz visitado la pag ${req.session.counter} veces`);
//   } else {
//     req.session.counter = 1;
//     res.send("Bienvenido");
//   }
// });
sessionRouter.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (!err) {
      res.redirect("/login");
    } else {
      res.json({ status: "Logout error", body: err });
    }
  });
});
// sessionRouter.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const isUser = await userManager.getUserByEmail(email);

//     if (!isUser) {
//       return res.status(404).json({ message: "Usuario no encontrado" });
//     }

//     if (!isValidPassword(isUser, password)) {
//       return res.send("Login Failed. password incorrect");
//     }

//     delete isUser.password;
//     req.session.user = isUser;
//     if (isUser.rol == "admin") {
//       req.session.admin = true;
//     } else {
//       req.session.admin = false;
//     }
//     req.session.isLogin = true;
//     res.redirect("/products");
//   } catch (error) {
//     console.log(error);
//   }
// });

sessionRouter.post('/login',passport.authenticate('login',{failureRedirect:'/faillogin'}),async(req,res)=>{
  if(!req.user) return res.status(400).send({status:"error",error:"Invalid credentials"});
  req.session.user = {
    first_name:req.user.first_name,
    last_name:req.user.last_name,
    age:req.user.age,
    email:req.user.email
  }
  res.send({status:"succes",payload:req.user});
})
sessionRouter.get("/faillogin",(req,res)=>{
  res.send({error:"Failed login"});
})
sessionRouter.post("/register",passport.authenticate('register',{failureRedirect:'/failRegister'}),async(req,res)=>{
  res.send({status:"success", message:"User registered"})
}); 
sessionRouter.get("/failRegister",async(req,res)=>{
  console.log("Failed Strategy");
  res.send({error:"Failed"});
})

export default sessionRouter;
