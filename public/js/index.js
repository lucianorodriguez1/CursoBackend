const socket = io();

const form = document.getElementById("myForm");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  let title = document.getElementById("title").value;
  let description = document.getElementById("description").value;
  let price = document.getElementById("price").value;
  let category = document.getElementById("category").value;
  let code = document.getElementById("code").value;
  let stock = document.getElementById("stock").value;
  let thumbnails = document.getElementById("thumbnails").value;
  let status = document.getElementById("status").value;

  let thu, cod, pr, sto, stat;

  if (typeof thumbnails === "string") thu = JSON.parse(thumbnails);

  if (typeof code === "string") cod = parseInt(code);

  if (typeof price === "string") pr = parseFloat(price);

  if (typeof status === "string") stat = status === "true";

  if (typeof stock === "string") sto = parseInt(stock);

  const product = {
    title,
    description,
    price: pr,
    category,
    code: cod,
    stock: sto,
    thumbnails: thu,
    status: stat,
  };

  socket.emit("newProduct", product);
});

socket.on("products", (data) => {
  const listProducts = document.getElementById("liveProducts");
  data.forEach((product) => {
    const productDiv = document.createElement("div");

    const titleElement = document.createElement("h2");
    titleElement.textContent = `Title: ${product.title}`;

    const descriptionElement = document.createElement("p");
    descriptionElement.textContent = `Description: ${product.description}`;

    const priceElement = document.createElement("p");
    priceElement.textContent = `Price: ${product.price}`;

    const categoryElement = document.createElement("p");
    categoryElement.textContent = `Category: ${product.category}`;

    const codeElement = document.createElement("p");
    codeElement.textContent = `Code: ${product.code}`;

    const stockElement = document.createElement("p");
    stockElement.textContent = `Stock: ${product.stock}`;

    const statusElement = document.createElement("p");
    statusElement.textContent = `status: ${product.status}`;

    const thumbnailsElement = document.createElement("p");
    thumbnailsElement.textContent = `Thumbnails: ${product.thumbnails}`;

    const idElement = document.createElement("p");
    idElement.textContent = `ID: ${product.id}`;

    const buttonDelete = document.createElement("button");
    buttonDelete.textContent = "Eliminar"

    productDiv.appendChild(titleElement);
    productDiv.appendChild(descriptionElement);
    productDiv.appendChild(priceElement);
    productDiv.appendChild(categoryElement);
    productDiv.appendChild(codeElement);
    productDiv.appendChild(stockElement);
    productDiv.appendChild(statusElement);
    productDiv.appendChild(thumbnailsElement);
    productDiv.appendChild(idElement);
    productDiv.appendChild(buttonDelete);

    listProducts.appendChild(productDiv);
  });
});
