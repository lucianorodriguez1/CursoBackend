import {Router} from 'express';
import { viewHome, viewProducts,viewProductById,viewCartById,viewRegister,viewLogin, viewProfile, reestablecerContrasenia, mandarEmail} from '../controllers/viewsControllers.js';
import { passportCall } from '../middlewares/passport.middleware.js';
import { authorization } from '../middlewares/auth.middleware.js';

const viewsRouter = Router();

viewsRouter.get("/",viewHome);
viewsRouter.get("/products", viewProducts);
viewsRouter.get("/products/:pid", viewProductById);
viewsRouter.get("/carts/:cid", viewCartById);
viewsRouter.get("/register",viewRegister);
viewsRouter.get("/login",viewLogin);
viewsRouter.get("/profile",passportCall("jwt"),authorization("user"),viewProfile);
viewsRouter.get("/reestablecerContrasenia",reestablecerContrasenia);
viewsRouter.get("/mandarEmail",mandarEmail);

export default viewsRouter;