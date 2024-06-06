import mongoose from "mongoose";

const ticketCollection = 'tickets'

const ticketSchema = new mongoose.Schema({


})


const ticketModel = mongoose.model(ticketCollection,ticketSchema);

export default userModel;