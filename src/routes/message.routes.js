import { Router } from "express";
import messageModel from "../dao/mongo/models/message.model.js";
import { passportCall } from "../middlewares/passport.middleware.js";
import { authorization } from "../middlewares/auth.middleware.js";

const messageRouter = Router();

messageRouter.get("/",async(req,res)=>{
    try {
        const result = await messageModel.find();
        res.status(200).json({messages:result})
    } catch (error) {
        res.status(500).json({message:"Error controlador message"})
    }
});
messageRouter.post("/",passportCall('jwt'),authorization('user') ,async(req,res)=>{
    const {correo,message} = req.body;
    try {
        const result = await messageModel.insertMany({correo,message});
        res.status(201).json({status:"succes",messages:"Mensaje creado",payload:result})
    } catch (error) {
        res.status(500).json({message:"Error controlador message"})
    }
});

export default messageRouter;
