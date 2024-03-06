import { promises as fs } from "fs";

export default class ProductManager {
  constructor(path) {
    this.products = [];
    this.path = path;
  }

  verifyFields({ title, description, price, thumbnail, code, stock }) {
    if (!title || !description || !price || !thumbnail || !code || !stock) {
      return false;
    } else {
      return true;
    }
  }

  async getProducts() {
    try {
      const fileExists = await fs
        .access(this.path)
        .then(() => true)
        .catch(() => false);

      if (fileExists) {
        const productsFile = await fs.readFile(this.path, "utf-8");
        const products = JSON.parse(productsFile);
        return products;
      } else {
        console.log("File does not exist.");
        return [];
      }
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  async addProduct(product) {
    const existingCode = (await this.getProducts()).some(
      (p) => p.code == product.code
    );
    const completedFields = this.verifyFields(product);

    if (existingCode) {
      console.log(`Product with code ${product.code} already exists.`);
    } else if (!completedFields) {
      console.log("Product information is incomplete.");
    } else {
      try {
        const products = await this.getProducts();
        product.id = products[products.length - 1].id + 1;

        products.push(product);
        console.log(`Product with code ${product.code} successfully added.`);

        await fs.writeFile(this.path, JSON.stringify(products, null, "\t"));
      } catch (error) {
        console.log(error);
      }
    }
  }

  async getProductById(id) {
    const products = await this.getProducts();
    const product = products.find((product) => product.id == id);
    if (!product) {
      console.log(`Product with id ${id} does not exist`);
    } else {
      return product;
    }
  }

  async updateProduct(id, updateProduct) {
    try {
      const products = await this.getProducts();
      const product = products.find((product) => product.id == id);
      const index = products.findIndex((product) => product.id == id);
      products[index] = { ...product, ...updateProduct };
      await fs.writeFile(this.path, JSON.stringify(products, null, "\t"));
      console.log("Product updated successfully.");
    } catch (error) {
      console.log(error);
    }
  }

  async deleteProduct(id) {
    try {
      const products = await this.getProducts();
      const index = products.findIndex((product) => product.id == id);
      products.splice(index, 1);
      await fs.writeFile(this.path, JSON.stringify(products, null, "\t"));
      console.log("Producto eliminado exitosamente.");
    } catch (error) {
      console.log(error);
    }
  }
}

