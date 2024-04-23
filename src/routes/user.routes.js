import { Router } from "express";
import { getUser, getUsers} from "../controllers/user.controllers.js";

const userRouter = Router();

userRouter.get("/",getUsers);
userRouter.get("/:uid",getUser);

export default userRouter;
