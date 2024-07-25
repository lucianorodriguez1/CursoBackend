import { ticketRepository } from "../repositories/index.js";
import { v4 as uuidv4 } from "uuid";
import TicketDTO from "../dto/TicketDto.js";


export const getTickets = async (req, res) => {

    let result = await ticketRepository.getTickets();
    
    const ticketsDto = result.map((ticket)=>TicketDTO.getTicketDto(ticket));
    res.status(200).json({succes:true,data:ticketsDto})
}

export const getTicketById = async (req, res) => {

    const id = req.params.tid


    const ticket = await ticketRepository.getTicketById(id);
    if (!ticket){
        res.status(404).json({success:false,message:'Ticket not found'});
    }

    const ticketDto = TicketDTO.getTicketDto(result);
    res.status(200).json({success:true,data:ticketDto});
}



export const deleteTicketById = async (req, res) => {
    const id = req.params.tid;
    const ticket = await ticketRepository.getTicketById(id);


    if (!ticket){
        res.status(404).json({success:false,message:'Ticket not found'});
    }

    const result = await ticketRepository.getTicketById(id);
    res.status(200).json({success:true,data:result});

}
