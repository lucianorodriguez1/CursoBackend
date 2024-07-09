import { ticketRepository } from "../repositories/index.js";
import { v4 as uuidv4 } from "uuid";
import TicketDTO from "../dto/TicketDto.js";

class TicketService {
  constructor() {
  }

  async getTickets() {
    let result = await ticketRepository.getTickets();
    const ticketDto = result.map((ticket)=>TicketDTO.getTicketDto(ticket));
    return ticketDto;
  }

  async createTicket(data) {
    const ticket = {
      code: uuidv4(),
      purchase_datetime: new Date(),
      amount: data.amount,
      purchaser: data.purchaser,

    }
    let result = await ticketRepository.createTicket(ticket);
    return result;
  }

  async getTicketById(id) {
    let result = await ticketRepository.getTicketById(id);
    const ticketDto = TicketDTO.getTicketDto(result);
    return ticketDto;
  }
  async deleteTicketById(id) {
    await ticketRepository.deleteTicketById(id);
    return 'El ticket fue eliminado';
  }
}

const ticketService = new TicketService();
export default ticketService;