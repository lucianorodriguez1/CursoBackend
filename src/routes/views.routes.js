import {Router} from 'express';
import { viewHome,viewChat, viewProducts,viewProductById,viewCartById} from '../controllers/views.controllers.js';

const viewsRouter = Router();

viewsRouter.get("/", viewHome);
viewsRouter.get("/chat", viewChat);
//PRUEBAS*************
viewsRouter.get("/products", viewProducts);
viewsRouter.get("/products/:pid", viewProductById);
viewsRouter.get("/carts/:cid", viewCartById);

export default viewsRouter;