import { ticketRepository } from "../repositories/index.js";
import { v4 as uuidv4 } from "uuid";

class TicketService {
  constructor() {
  }

  async getTickets() {
    let result = await ticketRepository.getTickets();
    return result;
  }

  async createTicket(data) {
    const ticket = {
      code: uuidv4(),
      purchase_datetime: new Date(),
      amount: data.totalPrice,
      purchaser: data.email,

    }
    let result = await ticketRepository.createTicket(ticket);
    return result;
  }

  async getTicketById(id) {
    let result = await ticketRepository.getTicketById(id);
    return result;
  }
  async deleteTicketById(id) {
    let result = await ticketRepository.deleteTicketById(id);
    return result;
  }
}

const ticketService = new TicketService();
export default ticketService;