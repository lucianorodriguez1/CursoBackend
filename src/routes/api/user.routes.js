import { Router } from "express";
import { users } from '../../controllers/index.js';
import { passportCall, passportCallOptional } from "../../middlewares/passportMiddleware.js";
authorization
import { uploader } from "../../utils/multer.js";
import { authorization } from "../../middlewares/authMiddleware.js";

const userRouter = Router();

userRouter.get("/",passportCallOptional('jwt'),users.getUsers);
userRouter.get("/:uid",passportCallOptional('jwt'),users.getUser);
userRouter.delete("/:uid",passportCall('jwt'),authorization('admin'), users.deleteUser);
userRouter.put("/:uid",users.updateUser);
userRouter.get("/premium/:uid", passportCall('jwt'),authorization('user'),users.changePremium);
userRouter.post("/sendEmailToResetPassword",passportCall('jwt'),users.sendEmailToResetPassword);
userRouter.post("/resetPassword",passportCall('jwt'),users.resetPassword)
/*
userRouter.post('/:uid/documents', uploader.fields([
    { name: 'identification', maxCount: 1 },
    { name: 'proofOfResidence', maxCount: 1 },
    { name: 'accountStatement', maxCount: 1 }
  ]), users.uploadDocuments);
  */
userRouter.post('/:uid/profiles', uploader.single('profile'), users.uploadProfilePhoto)

export default userRouter;
