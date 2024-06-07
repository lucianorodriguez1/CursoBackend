import { Router } from "express";
import { generateProduct } from "../utils/fakerUtil.js";

const mockingRouter = Router();
let products = [];

mockingRouter.get("/products",async(req,res)=>{
    for(let i = 0;i<50;i++){
        const product = generateProduct(i);
        products.push(product);
    }
    res.send({status:"succes",total:products.length,payload:products})

});


export default mockingRouter;
