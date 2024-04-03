import { messageManager } from "../models/message.model.js";

//PRUBEAS***********
export const getMessages = async (req, res) => {
  try {
    const messages = await messageManager.getElements();
    res.status(200).json({ status: "succes", data: messages });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "error en el servidor" });
  }
};
export const CreateMessage = async (req, res) => {
  try {
    const { user, message } = req.body;
    const newMessage = await messageManager.addElements({ user, message });
    res.redirect("http://localhost:8080/chat");
    //res.status(201).json({ status: "succes", data: newMessage });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "error en el servidor" });
  }
};