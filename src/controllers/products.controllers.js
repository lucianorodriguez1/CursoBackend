import { productsService } from "../repositories/index.js";
import { generateProductErrorInfo } from "../services/errors/info.js";
import CustomError from "../services/errors/CustomError.js";
import { ErrorCodes } from "../services/errors/enums.js";

export const getProducts = async (req, res) => {
  try {
    let { limit, page, sort, query } = req.query;
    let response = await productsService.getProducts(limit, page, sort, query);

    return res.status(200).json({ status: "succes", data: response });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "error en el servidor" });
  }
};

export const createProduct = async (req, res,next) => {
  try{
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
      !title ||
      !description ||
      !code ||
      !status ||
      !stock ||
      !category ||
      !thumbnail
    ) {
      CustomError.createError({
        name: "Product creation error",
        cause: generateProductErrorInfo({
          title,
          description,
          code,
          price,
          status,
          stock,
          category,
          thumbnail,
        }),
        message: "Error trying to create Product",
        code: ErrorCodes.INVALID_TYPES_ERROR,
      });
    }
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
    res.status(201).json({ message: "Producto agregado correctamente: ", data });
  }catch(error){
    next(error);
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

    const response = await productsService.updateProductById(id, {
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnail,
    });
    if (response) {
      return res.status(200).json({
        status: "succes",
        message: "Producto actualizado con éxito",
        data: response,
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
