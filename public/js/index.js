const socket = io();

const form = document.getElementById('myForm');

form.addEventListener('submit', (e)=> {
  e.preventDefault();

  let title = document.getElementById('title').value;
  let description = document.getElementById('description').value;
  let price = document.getElementById('price').value;
  let category = document.getElementById('category').value;
  let code = document.getElementById('code').value;
  let stock = document.getElementById('stock').value;
  let thumbnails = document.getElementById('thumbnails').value;
  let status = document.getElementById('status').value;

  let thu,cod,pr,sto,stat;

  if (typeof thumbnails === "string")
    thu = JSON.parse(thumbnails);
    
  if (typeof code === "string") 
    cod = parseInt(code);
  

  if (typeof price === "string") 
    pr = parseFloat(price);
  

  if (typeof status === "string") 
    stat = status === "true";
 
  if (typeof stock === "string") 
    sto = parseInt(stock);
  

  const product = {
    title,
    description,
    price:pr,
    category,
    code:cod,
    stock:sto,
    thumbnails:thu,
    status:stat
  }

  socket.emit('newProduct', "Estoy enviando desde cliente el nuevo producto : ", product);
});