import { Router } from 'express';
import { purchases } from '../../controllers/index.js';
import { passportCall } from '../../middlewares/passportMiddleware.js';
import { authorization } from '../../middlewares/authMiddleware.js';

const purchaseRouter = Router();

purchaseRouter.post('/:cid', passportCall('jwt'),authorization('user','premium'),purchases.createPurchase);

export default purchaseRouter;
 