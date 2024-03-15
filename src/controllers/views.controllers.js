import ProductManager from "../models/ProductManager.js";

const productManager = new ProductManager("./products.json");

export const viewHome = async(req,res) => {
    res.render('index',{
        products:(await productManager.getProducts())
    })
}

export const viewRealTimeProducts = async(req,res) => {
    res.render('../views/realTimeProducts',{
        products:(await productManager.getProducts()),
    })
}