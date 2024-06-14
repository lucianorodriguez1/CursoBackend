import { Router } from "express";

const loggerRouter = Router();

loggerRouter.get("/",async (req,res)=>{

    req.logger.debug("test debug");
    req.logger.http("test http");
    req.logger.info("test info");
    req.logger.warning("test warning");
    req.logger.error("test error");
    req.logger.fatal("test fatal");

    res.send("Se realizo el test Logger en la terminal");
});

export default loggerRouter;
