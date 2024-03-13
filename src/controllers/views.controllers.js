import ProductManager from "../models/ProductManager.js";

const productManager = new ProductManager("./products.json");

export const viewHome = async(req,res) => {
    res.render('home',{
        products:(await productManager.getProducts())
    })
}