import {Router} from 'express';

import productRouter from "./products.routes.js";
import cartRouter from "./cart.routes.js";
import sessionRouter from "./session.routes.js";
import userRouter from "./user.routes.js";
import messageRouter from "./message.routes.js";
import mailRouter from './email.routes.js';
import ticketRouter from './tickets.routes.js';
import purchaseRouter from './purchase.routes.js'

const router = Router();

router.use('/products/', productRouter);
router.use('/users/', userRouter);
router.use("/carts/", cartRouter);
router.use("/sessions/", sessionRouter);
router.use("/messages/",messageRouter);
router.use("/mail/",mailRouter);
router.use("/tickets/",ticketRouter);
router.use("/purchases/",purchaseRouter)

export default router;
