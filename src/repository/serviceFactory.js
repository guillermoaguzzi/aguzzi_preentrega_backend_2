const ProductRepository = require("./products.repository");
const CartRepository = require("./carts.repository");
const { Products } = require("../dao/factory");
const { Carts } = require("../dao/factory");

function initializeServices() {
  const productService = new ProductRepository(new Products());
  const cartService = new CartRepository(new Carts(), productService);
  return { productService, cartService };
}

module.exports = initializeServices;
