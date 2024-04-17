import {Router} from 'express';
import { viewHome,viewChat, viewProducts,viewProductById,viewCartById,viewRegister,viewLogin, viewProfile} from '../controllers/views.controllers.js';
import { isLogin } from '../middlewares/auth.middleware.js';
isLogin

const viewsRouter = Router();

viewsRouter.get("/", viewHome);
viewsRouter.get("/chat", viewChat);
viewsRouter.get("/products", viewProducts);
viewsRouter.get("/products/:pid", viewProductById);
viewsRouter.get("/carts/:cid", viewCartById);


//PRUEBAS***
viewsRouter.get("/register",viewRegister);
viewsRouter.get("/login",viewLogin);
viewsRouter.get("/profile",isLogin,viewProfile);

export default viewsRouter;