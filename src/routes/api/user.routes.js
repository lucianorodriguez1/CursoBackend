import { Router } from "express";
import { users } from '../../controllers/index.js';
import { passportCall, passportCallOptional } from "../../middlewares/passportMiddleware.js";

const userRouter = Router();

userRouter.get("/",passportCallOptional('jwt'),users.getUsers);
userRouter.get("/:uid",users.getUser);
userRouter.delete("/:uid",users.deleteUser);
userRouter.put("/:uid",users.updateUser);
userRouter.get("/premium/:uid",users.changePremium);
userRouter.post("/sendEmailToResetPassword",users.sendEmailToResetPassword);
userRouter.post("/resetPassword",users.resetPassword);
userRouter.delete("/inactives",users.deleteInactives);
/* PROBAR
userRouter.post('/:uid/documents',users.createDocuments);
*/

export default userRouter;
