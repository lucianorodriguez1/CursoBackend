import { Router } from "express";

import { passportCall } from "../../middlewares/passport.middleware.js";
import { sessions } from "../../controllers/index.js";

const sessionRouter = Router();

sessionRouter.post("/register", sessions.register);
sessionRouter.post("/login", sessions.login);
sessionRouter.get("/logout", passportCall("jwt"),sessions.logout);
sessionRouter.get("/current", passportCall("jwt"), sessions.current);

export default sessionRouter;
