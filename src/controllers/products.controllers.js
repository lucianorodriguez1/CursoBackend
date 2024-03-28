import { productManager } from "../models/product.model.js";

export const getProducts = async (req, res) => {
  try {
    let products = await productManager.getElements();
    let limit = req.query.limit;

    if (!limit) return res.status(200).json({status:"succes",data:products});

    let productsLimits = products.slice(0, limit);
    res.json(productsLimits);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "error en el servidor" });
  }
};

export const createProduct = async (req, res) => {
  try {
    const {
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnail,
    } = req.body;

    const data = await productManager.addElements({
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnail,
    });
    res
      .status(201)
      .json({ message: "Producto agregado correctamente: ", data });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const getProductById = async (req, res) => {
  try {
    const id = req.params.pid;
    const response = await productManager.getElementById({ _id: id });
    if (response) {
      return res
        .status(200)
        .json({ message: "Producto encontrado con exito", data: response });
    }
    res.status(404).json({ message: "Product not found" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "error en el servidor" });
  }
};

export const updateProductById = async (req, res) => {
  try {
    const id = req.params.pid;
    const {
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnail,
    } = req.body;

    const response = await productManager.updateElement(
      { _id: id },
      {
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnail,
      }
    );
    if (response) {
      return res.status(200).json({
        status: "succes",
        message: "Producto actualizado con éxito",
      });
    }
    res.status(404).json({
      message: "Product not found",
    });
  } catch (error) {
    console.log(error);
  }
};

export const deleteProductById = async (req, res) => {
  try {
    let id = req.params.pid;
    const response = await productManager.deleteElement({ _id: id });
    if (response) {
      return res
        .status(200)
        .json({ status: "success", message: "Producto eliminado con éxito" });
    }
    res.status(404).json({ message: "Product not found" });
  } catch (error) {
    console.log(error);
  }
};
