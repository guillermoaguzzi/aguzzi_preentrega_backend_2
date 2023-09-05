const { Router } = require("express");
const fs = require('fs');
const path = require('path');
const pathProducts = require("../../db/fs/products.json");
const pathCarts = require("../../db/fs/carts.json");


class FsCartsRoutes{
path = "/fs/carts";
router = Router();
pathProducts = pathProducts
pathCarts = pathCarts

constructor() {
  this.initFsCartsRoutes();
}

initFsCartsRoutes() {
  const router = this.router;
  const pathProducts  = this.pathProducts;
  const pathCarts = this.pathCarts;



this.router.get(`${this.path}/`, async (req, res) => {
  try {
		const data = await fs.promises.readFile(pathCarts, 'utf-8');
		const carts = JSON.parse(data);
    res.send(carts);
  } catch (error) {
    console.error('Failed reading file', error);
    res.status(500).json({ error: 'Failed reading file' });
	}
});


// "(...)  La ruta GET /:cid deberá listar los productos que pertenezcan al carrito con el parámetro cid proporcionados (...)" (consignas.txt:33)
this.router.get(`${this.path}/:cid`, async(req, res) => {
  try {
		const data = await fs.promises.readFile(pathCarts, 'utf-8');
		const carts = JSON.parse(data);
    const { cid } = req.params;
    const cartById = carts.find((cart) => cart.id == cid);
    if (cartById) return res.json(cartById.products);
    res.status(404).json({ error: "Cart not found" });
} catch (error) {
  console.error('Failed reading file', error);
  res.status(500).json({ error: 'Failed reading file' });
}
});



// "(...)  La ruta raíz POST / deberá crear un nuevo carrito con la siguiente estructura (...)" (consignas.txt:29)
this.router.post(`${this.path}/`, async (req, res) => {
  try {
		const data = await fs.promises.readFile(pathCarts, 'utf-8');
		const carts = JSON.parse(data);
  const { products = [] } = req.body;
  const ids = carts.map(cart => cart.id);
  const id = Math.max(...ids) + 1;
  const cartProducts = products.map(({ id, quantity }) => ({ id, quantity }));
  const cart = { id, products: cartProducts };
  carts.push(cart);
  await fs.promises.writeFile(pathCarts,JSON.stringify(carts,null,'\t') )
  res.status(201).json(cart);
} catch (error) {
  console.error('Failed reading file', error);
  res.status(500).json({ error: 'Failed reading file' });
}
});


// "(...)  La ruta POST  /:cid/product/:pid deberá agregar el producto al arreglo “products” del carrito seleccionado (...)" (consignas.txt:35)
this.router.post(`${this.path}/:cid/product/:pid`, async(req, res) => {
  try {
		const dataCarts = await fs.promises.readFile(pathCarts, 'utf-8');
		const carts = JSON.parse(dataCarts);
    const dataProducts = await fs.promises.readFile(pathProducts, 'utf-8');
		const products = JSON.parse(dataProducts);

  const { cid, pid } = req.params;
  const { quantity } = req.body;
  const cartById = carts.find((cart) => cart.id == cid);
  if (cartById) {
    const productById = products.find((product) => product.id == pid);
    if (productById) {
      const { id } = productById;
      // "(...)  product: SÓLO DEBE CONTENER EL ID DEL PRODUCTO (...) (...)   quantity: debe contener el número de ejemplares de dicho producto (...)" (consignas.txt:36:37)
      const productNew = { id, quantity };
      const productExist = cartById.products.find((product) => product.id == id);
      // "(...)  si un producto ya existente intenta agregarse al producto, incrementar el campo quantity de dicho producto (...)" (consignas.txt:39)
      if (productExist) {
      productExist.quantity = productExist.quantity + productNew.quantity
      await fs.promises.writeFile(pathCarts,JSON.stringify(carts,null,'\t') )
      return res.status(201).json(cartById);
      }else{
      cartById.products.push(productNew);
      await fs.promises.writeFile(pathCarts,JSON.stringify(carts,null,'\t') )
      return res.status(201).json(cartById);}
    }
  }
  res.status(404).json({ error: "Cart or Product not found" });
} catch (error) {
  console.error('Failed reading file/s', error);
  res.status(500).json({ error: 'Failed reading file/s' });
}
});
}
}

module.exports = FsCartsRoutes;



