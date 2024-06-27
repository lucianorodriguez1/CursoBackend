import { Router } from "express";
import { users } from '../../controllers/index.js';
import { passportCall } from "../../middlewares/passportMiddleware.js";

const userRouter = Router();

userRouter.get("/",passportCall('jwt'),users.getUsers);
userRouter.get("/:uid",users.getUser);
userRouter.delete("/:uid",users.deleteUser);
userRouter.put("/:uid",users.updateUser);
userRouter.get("/premium/:uid",users.changePremium);
userRouter.post("/sendEmailToResetPass",users.sendEmailToResetPassword);
userRouter.post("/restorePassword",users.resetPassword);
userRouter.delete("/inactives",users.deleteInactives);
/* PROBAR
userRouter.post('/:uid/documents',users.createDocuments);
*/

export default userRouter;
