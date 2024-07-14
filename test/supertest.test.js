import mongoose from "mongoose";
import { expect } from "chai";
import supertest from "supertest";

import config from "../src/config/config.js";
import Product from "../src/dao/mongo/ProductMongo.js";

const productMongo = new Product();
const requester = supertest(`${config.AppUrl}:${config.port}`);
mongoose.connect(config.mongoUrl);

describe("Testing E-commerce", async function () {
  let cookie;
  let productId;
  before(async function () {
    const loginResponse = await requester.post("/api/sessions/login").send({
      email: "admin@gmail.com",
      password: "admin",
    });
    const cookies = loginResponse.headers['set-cookie'];
    if (cookies) {
      cookie = cookies[0].split(';')[0];
    }

  });

  describe("Test de productos", function () {
    this.timeout(5000);

    it("POST /api/products debe crear un producto correctamente", async function () {
      const productMock = {
        title: "producto test 2",
        description: "descripcion del producto test 2",
        code: 10,
        price: 300,
        status: true,
        stock: 5,
        category: "test",
        thumbnail: [],
      };
      const { statusCode, ok, body } = await requester
        .post("/api/products")
        .set("Cookie", cookie)
        .send(productMock);
      expect(statusCode).to.equal(201);
      expect(ok).to.be.true;
      expect(body.data).to.have.property("title", "producto test 2");
      productId = body.data.id
    });

    it("GET /api/products debe obtener todos los productos correctamente", async function () {
      const { statusCode, ok, body } = await requester
        .get("/api/products")
        .set("Cookie", cookie)
      expect(statusCode).to.equal(200);
      expect(ok).to.be.true;
    });

    it("GET /api/products/:pid debe obtener un producto por su ID", async function () {
      const { statusCode, ok, body } = await requester
        .get(`/api/products/${productId}`)
        .set("Cookie", cookie)
      expect(statusCode).to.equal(200);
      expect(ok).to.be.true;
      expect(body.data).to.have.property("id", productId);
    });

    it("PUT /api/products/:pid debe actualizar un producto por su ID", async function () {
      const updateMock = {
        title: "producto actualizado",
        description: "descripcion actualizada",
        price: 400,
        stock: 10,
      };
      const { statusCode, ok, body } = await requester
        .put(`/api/products/${productId}`)
        .set("Cookie", cookie)
        .send(updateMock);
      expect(statusCode).to.equal(200);
      expect(ok).to.be.true;
    });

    it("DELETE /api/products/:pid debe eliminar un producto por su ID", async function () {
      const { statusCode, ok, body } = await requester
        .delete(`/api/products/${productId}`)
        .set("Cookie", cookie)
      expect(statusCode).to.equal(200);
      expect(ok).to.be.true;
    });
  });
});
