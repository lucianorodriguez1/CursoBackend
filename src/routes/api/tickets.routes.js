import { Router } from 'express';

import { tickets } from '../../controllers/index.js';
const ticketRouter = Router();

ticketRouter.get('/', tickets.getTickets);
ticketRouter.get('/:tid', tickets.getTicketById);
ticketRouter.delete('/:tid', tickets.deleteTicketById);

export default ticketRouter;
