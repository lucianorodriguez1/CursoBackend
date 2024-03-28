import {Router} from 'express';
import { viewHome, viewRealTimeProducts } from '../controllers/views.controllers.js';

const viewsRouter = Router();

viewsRouter.get("/", viewHome);
viewsRouter.get("/realtimeproducts", viewRealTimeProducts);

export default viewsRouter;