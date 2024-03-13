import express from "express";
import handlebars from "express-handlebars";
import __dirname from "./utils.js";
import productRouter from "./routes/products.routes.js";
import cartRouter from "./routes/cart.routes.js";

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/static',express.static(__dirname + '/public'));

app.listen(PORT, () => {
  console.log(`listening to the server on PORT ${PORT}`);
});

app.use("/api/products/", productRouter);
app.use("/api/carts/", cartRouter);

app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");

/*
app.get("/", (req, res) => {
  const name = "Lucho";

  res.render("index", {
    name: name,
  });
});

*/
