import {Router} from 'express';
import { viewHome,viewChat, viewProducts,viewProductById,viewCartById,viewRegister,viewLogin} from '../controllers/views.controllers.js';

const viewsRouter = Router();

viewsRouter.get("/", viewHome);
viewsRouter.get("/chat", viewChat);
viewsRouter.get("/products", viewProducts);
viewsRouter.get("/products/:pid", viewProductById);
viewsRouter.get("/carts/:cid", viewCartById);


//PRUEBAS***
viewsRouter.get("/register",viewRegister);
viewsRouter.get("/login",viewLogin);


export default viewsRouter;