import { Router } from "express";
import { users } from '../../controllers/index.js';

const userRouter = Router();

userRouter.get("/",users.getUsers);
userRouter.get("/:uid",users.getUser);
userRouter.delete("/:uid",users.deleteUser);
userRouter.put("/:uid",users.updateUser);
userRouter.get("/premium/:uid",users.changePremium)

export default userRouter;
