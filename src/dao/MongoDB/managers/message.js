import messageModel from "../models/message.js";

class MessageMongoDBManager {
  constructor() {}

  async getMessages() {
    try {
        return await messageModel.find();
    } catch (error) {
      console.log(error);
    }
  }

  async createMessage(data) {
    try {
        return await messageModel.insertMany(data);
    } catch (error) {
      console.log(error);
    }
  }
}

export const messageManager = new MessageMongoDBManager();
