import mongoose from "mongoose";

const ticketCollection = "tickets";

const ticketSchema = new mongoose.Schema({
  code: {
    type: String,
    unique: true,
    default: () => uuidv4(), // Genera un código único automáticamente
  },
  purchase_datetime: {
    type: Date,
    default: Date.now, // Guarda la fecha y hora exacta de la compra automáticamente
  },
  amount: {
    type: Number,
    required: true, // Asegura que este campo sea obligatorio
  },
  purchaser: {
    type: String,
    required: true, // Asegura que este campo sea obligatorio
  },
});

const ticketModel = mongoose.model(ticketCollection, ticketSchema);

export default ticketModel;
