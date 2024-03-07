import { promises as fs } from "fs";

export default class ProductManager {
  constructor(path) {
    this.products = [];
    this.path = path;
  }

  verifyFields({
    title,
    description,
    price,
    category,
    thumbnail,
    code,
    stock,
  }) {
    if (
      !title ||
      !description ||
      !price ||
      !category ||
      !thumbnail ||
      !code ||
      !stock
    ) {
      return false;
    } else {
      return true;
    }
  }

  // async GetId() {
  //   const users = await this.getProducts();
  //   let id;

  //   if (users.length > 0) {
  //     return users[users.length - 1].id + 1;
  //   } else {
  //     return 1;
  //   }
  // }

  async getProducts() {
    try {
      const productsFile = await fs.readFile(this.path, "utf-8");
      const products = JSON.parse(productsFile);
      return products;
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  async addProduct(product) {
    try {
      const products = await this.getProducts();
      product.id = products[products.length - 1].id + 1;

      products.push(product);

      await fs.writeFile(this.path, JSON.stringify(products, null, "\t"));
    } catch (error) {
      console.log(error);
    }
  }

  async getProductById(id) {
    const products = await this.getProducts();
    const product = products.find((product) => product.id == id);
    if (!product) {
      return undefined;
    } else {
      return product;
    }
  }

  async updateProduct(id, updateProduct) {
    try {
      const products = await this.getProducts();
      const index = products.findIndex((product) => product.id == id);
      if (index == -1) return -1;
      for (const key in updateProduct) {
        if (updateProduct[key] !== undefined) {
          products[index][key] = updateProduct[key];
        }
      }
      await fs.writeFile(this.path, JSON.stringify(products, null, "\t"));
    } catch (error) {
      console.log(error);
    }
  }

  async deleteProduct(id) {
    try {
      const products = await this.getProducts();
      const index = products.findIndex((product) => product.id == id);
      if (index == -1) return -1;
      products.splice(index, 1);
      await fs.writeFile(this.path, JSON.stringify(products, null, "\t"));
    } catch (error) {
      console.log(error);
    }
  }
}
