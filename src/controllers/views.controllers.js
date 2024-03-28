import { productManager } from "../models/product.model.js";
import { messageManager } from "../models/message.model.js";

export const viewHome = async (req, res) => {
  try {
    const products = await productManager.getElements();

    res.render("index", {
        products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "error en el servidor" });
  }
};


//PRUEBAS***
export const viewChat = async (req,res)=>{
  try {
    const messages = await messageManager.getElements();
    console.log("Soy los mensajes: " + messages);//PRUEBA
    res.render("../views/chat",{
      messages
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "error en el servidor" });
  }
}

export const viewRealTimeProducts = async (req, res) => {
  res.render("../views/realTimeProducts", {
    //products:(await productManager.getElements()),
  });
};