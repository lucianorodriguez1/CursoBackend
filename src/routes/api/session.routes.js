import { Router } from "express";

import { passportCall } from "../../middlewares/passportMiddleware.js";
import { sessions } from "../../controllers/index.js";
import { authorization } from "../../middlewares/authMiddleware.js";

const sessionRouter = Router();

sessionRouter.post("/register", sessions.register);
sessionRouter.post("/login", sessions.login);
sessionRouter.get("/logout", passportCall("jwt"),sessions.logout);
sessionRouter.get("/current", passportCall("jwt"), sessions.current);
sessionRouter.delete("/inactives",passportCall('jwt'),authorization('admin'),sessions.deleteInactives);

export default sessionRouter;
