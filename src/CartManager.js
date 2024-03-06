import { promises as fs } from "fs";

export default class CartManager {
  constructor(path) {
    this.path = path;
    this.carts = [];
  }

  async getCarts() {
    try {
      // Verificar si el archivo existe antes de intentar leerlo
      const fileExists = await fs
        .access(this.path)
        .then(() => true)
        .catch(() => false);

      if (fileExists) {
        const cartsFile = await fs.readFile(this.path, "utf-8");
        const carts = JSON.parse(cartsFile);
        return Array.isArray(carts) ? carts : [];
      } else {
        console.log(`El archivo ${this.path} no existe.`);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async addCart(cart) {
    try {
      const carts = await this.getCarts();
      console.log("carts: ", carts);
      if (!carts) {
        cart.id = 1;
      } else {
        cart.id = carts[carts.length - 1].id + 1;
      }

      carts.push(cart);

      console.log("Cart agregado desde manager");
      console.log(cart);
      await fs.writeFile(this.path, JSON.stringify(carts, null, "\t"));
    } catch (error) {
      console.log(error);
    }
  }

  async addProductsToCart(idCart, { idProduct, quantity }) {
    try {
      const carts = await this.getCarts();
      const cart = carts.find((cart) => cart.id == idCart);
      const productIndex = cart.products.findIndex(
        (p) => p.idProduct == idProduct
      );

      if (productIndex !== -1) {
        // Si el producto ya existe, actualizar la cantidad
        cart.products[productIndex].quantity += quantity;
      } else {
        // Si el producto no existe, agregarlo al carrito
        cart.products.push({ idProduct, quantity });
      }

      console.log("Producto agregado al carrito");
      await fs.writeFile(this.path, JSON.stringify(carts, null, "\t"));
    } catch (error) {
      console.log(error);
    }
  }
}
