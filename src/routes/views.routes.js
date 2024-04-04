import {Router} from 'express';
import { viewHome,viewChat } from '../controllers/views.controllers.js';

const viewsRouter = Router();

viewsRouter.get("/", viewHome);
viewsRouter.get("/chat", viewChat);

export default viewsRouter;