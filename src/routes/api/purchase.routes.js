import { Router } from 'express';

import { purchases } from '../../controllers/index.js';
import { passportCall } from '../../middlewares/passportMiddleware.js';
import { authorization } from '../../middlewares/authMiddleware.js';

const purchaseRouter = Router();

purchaseRouter.post('/', passportCall('jwt'),authorization('admin'),purchases.createPurchases);

export default purchaseRouter;
 