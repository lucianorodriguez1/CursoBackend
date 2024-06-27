import { ticketRepository } from "../repositories/index.js";
class TicketService {
    constructor() {
    }
  
    async getTickets() {
      let result = await ticketRepository.getTickets();
      return result;
    }
  
    async createTicket(ticket) {
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

    async updateTicketById(id,data) {
      let result = await ticketRepository.updateTicketById(id,data);
      return result;
    }
  }
  
  const ticketService = new TicketService();
  export default ticketService;