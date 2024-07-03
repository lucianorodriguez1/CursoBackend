import { Router } from "express";
import { users } from '../../controllers/index.js';
import { passportCall, passportCallOptional } from "../../middlewares/passportMiddleware.js";
import { uploader } from "../../utils/multer.js";

const userRouter = Router();

userRouter.get("/",passportCallOptional('jwt'),users.getUsers);
userRouter.get("/:uid",passportCallOptional('jwt'),users.getUser);
userRouter.delete("/:uid",users.deleteUser);
userRouter.put("/:uid",users.updateUser);
userRouter.get("/premium/:uid",users.changePremium);
userRouter.post("/sendEmailToResetPassword",users.sendEmailToResetPassword);
userRouter.post("/resetPassword",users.resetPassword);
userRouter.delete("/inactives",users.deleteInactives);
userRouter.post('/:uid/documents',uploader.single('file'),users.createDocuments);

export default userRouter;
