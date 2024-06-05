//import Product from "../dao/mongo/product.dao.js";
import { productsService } from "../repositories/index.js";

export const getProducts = async (req, res) => {
  try {
    let { limit, page, sort, query } = req.query;
    let response = await productsService.getProducts(
      limit,
      page,
      sort,
      query
    );

    return res.status(200).json({ status: "succes", data: response });
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

    const data = await productsService.createProduct({
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
    if (
      error.message === "El código del producto ya existe en la base de datos."
    ) {
      res.status(400).json({ message: "Código de producto duplicado" });
    } else {
      console.error(error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }
}; 

export const getProductById = async (req, res) => {
  try {
    const id = req.params.pid;
    const response = await productsService.getProductById(id);
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

    const response = await productsService.updateProductById(
      id,
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
        data:response,
      });
    }
    res.status(404).json({
      message: "Product not found",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "error en el servidor" });
  }
};

export const deleteProductById = async (req, res) => {
  try {
    let id = req.params.pid;
    const response = await productsService.deleteProductById(id);
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
