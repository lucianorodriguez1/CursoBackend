import { Router } from "express";
import { userManager } from "../models/user.model.js";

const userRouter = Router();

userRouter.get("/",async (req,res)=>{
    res.send("Hola")
})

userRouter.post("/register", async (req, res) => {
  try {
    const { first_name, last_name, age, email, password } = req.body;

    const newUser = await userManager.addElements({
      first_name,
      last_name,
      age,
      email,
      password,
    });

    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default userRouter;
