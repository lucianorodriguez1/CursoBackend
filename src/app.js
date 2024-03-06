import express from 'express';
import productRouter from './routes/products.routes.js';
import cartRouter from './routes/cart.routes.js';

const app = express();
const PORT=8080;



app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.listen(PORT,()=>{console.log(`listening to the server on PORT ${PORT}`)});

app.use('/api/products/',productRouter);
app.use('/api/carts/',cartRouter);


