import ProductManager from "../models/ProductManager.js";

const productManager = new ProductManager("./products.json");

export const getProducts = async (req, res) => {
  try {
    let products = await productManager.getProducts();
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
      thumbnails,
    } = req.body;
    //viste realTimeProducts
    let thu,cod,pr,sto,stat;

    if (typeof thumbnails === "string") {
      thu = JSON.parse(thumbnails);
    } else {
      thu = thumbnails;
    }
      
    if (typeof code === "string") {
      cod = parseInt(code);
    } else {
      cod = code;
    }

    if (typeof price === "string") {
      pr = parseFloat(price);
    } else {
      pr = price;
    }

    if (typeof status === "string") {
      stat = status === "true";
    } else {
      stat = status;
    }
    if (typeof stock === "string") {
      sto = parseInt(stock);
    } else {
      sto = stock;
    }

    console.log("Soy los nuevos datos",{
      title,
      description,
      cod,
      pr,
      stat,
      sto,
      category,
      thu,
    })
    if (
      typeof title === "string" &&
      typeof description === "string" &&
      (typeof code === "number" || cod) &&
      (typeof price === "number" || pr) &&
      (typeof status === "boolean" || stat) &&
      (typeof stock === "number" || sto) &&
      typeof category === "string" &&
      (Array.isArray(thumbnails) &&
      thumbnails.length === 0 || thu) &&
      title &&
      description &&
      category &&
      code &&
      status &&
      stock
    ) {
      const existingCode = (await productManager.getProducts()).some(
        (p) => p.code === cod
      );
      if (existingCode) {
        res.status(400).json({ message: "El codigo de producto ya existe" });
      } else {
        const response = await productManager.addProduct({
          title,
          description,
          code:cod,
          price:pr,
          status:stat,
          stock:sto,
          category,
          thumbnails:thu,
        });
        console.log("Soy response : ", response);
        res
          .status(201)
          .json({ message: "Producto agregado correctamente: ", response });
      }
    } else {
      res.status(400).json({ message: "Campos incompletos o invalidos" });
      console.log({
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnails,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const getProductById = async (req, res) => {
  try {
    const id = req.params.pid;
    const response = await productManager.getProductById(id);
    if (!response)
      return res.status(404).json({ message: "Product not found" });
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
    const existingCode = (await productManager.getProducts()).some(
      (product) => product.code === code && product.id != id
    );

    if (existingCode) {
      res.status(400).json({ message: "El codigo de producto ya existe" });
    } else {
      const response = await productManager.updateProduct(id, {
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnail,
      });

      if (response == -1) {
        res.status(404).json({ message: "Product not found" });
      } else {
        res.status(200).json({ message: "Successfully updated product" });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

export const deleteProductById = async (req, res) => {
  try {
    let id = req.params.pid;
    const response = await productManager.deleteProduct(id);
    if (response == -1) {
      res.status(404).json({ message: "Product not found" });
    } else {
      res.status(200).json({ message: "Successfully deleted product" });
    }
  } catch (error) {
    console.log(error);
  }
};
