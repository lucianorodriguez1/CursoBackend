import {Router} from 'express';
import { viewHome } from '../controllers/views.controllers.js';

const viewsRouter = Router();

viewsRouter.get("/", viewHome);

export default viewsRouter;