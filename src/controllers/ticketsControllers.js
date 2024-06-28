import ticketService from "../services/TicketService.js";
import { response } from "../utils/response.js";


export const getTickets = async (req, res) => {
    let result = await ticketService.getTickets();
    response(res, 200, result);;
}

export const getTicketById = async (req, res) => {
    const id = req.params.tid
    let data = await ticketService.getTicketById(id);
    response(res, 200, data);;
}

export const deleteTicketById = async (req, res) => {
    const id = req.params.tid
    await ticketService.deleteTicketById(id);
    response(res, 200, 'ticket eliminado');
}
