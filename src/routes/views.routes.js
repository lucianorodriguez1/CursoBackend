import {Router} from 'express';
import { viewHome, viewRealTimeProducts,viewChat } from '../controllers/views.controllers.js';

const viewsRouter = Router();

viewsRouter.get("/", viewHome);
viewsRouter.get("/realtimeproducts", viewRealTimeProducts);
viewsRouter.get("/chat", viewChat);

export default viewsRouter;