import ProductManager from "../models/ProductManager.js";
import { ProductManagerMongoDB } from "../models/product.model.js";

const productManager = new ProductManagerMongoDB();

export const getProducts = async (req, res) => {
  try {
    let products = await productManager.getElements();
    let limit = req.query.limit;

    if (!limit) return res.json(products);

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
    if (
      typeof title === "string" &&
      typeof description === "string" &&
      typeof code === "number" &&
      typeof price === "number" &&
      typeof status === "boolean" &&
      typeof stock === "number" &&
      typeof category === "string" &&
      Array.isArray(thumbnail) &&
      thumbnail.length === 0 &&
      title &&
      description &&
      code &&
      price &&
      status &&
      stock &&
      category &&
      thumbnail
    ) {
      const existingCode = (await productManager.getElements()).some(
        (p) => p.code === code
      );

      if (existingCode) {
        res.status(400).json({ message: "El codigo de producto ya existe" });
      } else {
        const response = await productManager.addElements({
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
          .json({ message: "Producto agregado correctamente: ", response });
      }
    } else {
      res.status(400).json({ message: "Campos incompletos o invalidos" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const getProductById = async (req, res) => {
  try {
    const id = req.params.pid;
    const response = await productManager.getElementById({ _id: id });
    if (!response) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(response);
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
    const existingCode = (await productManager.getElements()).some(
      (product) => product.code === code && product.id != id
    );

    if (existingCode) {
      res.status(400).json({ message: "El codigo de producto ya existe" });
    } else {
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

      if (response == -1) {
        res.status(404).json({ message: "Product not found" });
      } else {
        res
          .status(201)
          .json({
            status: "succes",
            message: "Producto actualizado con éxito",
            data: response,
          });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

export const deleteProductById = async (req, res) => {
  try {
    let id = req.params.pid;
    const response = await productManager.deleteElement({ _id: id });
    if (response == -1) {
      res.status(404).json({ message: "Product not found" });
    } else {
      res
        .status(200)
        .json({ status: "success", message: "Producto eliminado con éxito" });
    }
  } catch (error) {
    console.log(error);
  }
};
