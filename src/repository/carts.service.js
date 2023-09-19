const {Carts} = require ("../dao/factory");
const CartRepository = require ("./carts.repository");

const CartService = new CartRepository();

module.exports = CartService


