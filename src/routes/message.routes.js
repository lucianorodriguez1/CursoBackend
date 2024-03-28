import { Router } from "express";
import { CreateMessage, getMessages } from "../controllers/message.controllers.js";

const messageRouter = Router();

messageRouter.get("/",getMessages);
messageRouter.post("/",CreateMessage);


export default messageRouter;

