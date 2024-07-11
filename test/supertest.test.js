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

/*
beforeEach(function () {
    this.timeout(5000);
});
*/
describe("Test de productos", function () {
    this.timeout(5000);
    it("POST /api/products debe crear un producto correctamente", async function () {
      const productMock = {
        title: "producto test 1",
        description: "descripcion del producto test 1",
        code: 9,
        price: 250,
        status: true,
        stock: 1,
        category: "test",
        thumbnail: [],
      };
      const { statusCode, ok, body } = await requester
        .post("/api/products")
        .set("Authorization", `Bearer ${cookie}`)
        .send(productMock);
      expect(statusCode).to.equal(201);
      expect(ok).to.be.true;
      expect(body).to.have.property("title", "producto test 1");
    });
  });
});
