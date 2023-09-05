const {Products} = require ("../dao/factory");
const ProductRepository = require ("./products.repository");
const {Carts} = require ("../dao/factory");
const CartRepository = require ("./carts.repository");
const {Users} = require ("../dao/factory");
const UserRepository = require("./sessions.repository");

const ProductService = new ProductRepository(new Products());
const CartService = new CartRepository(new Carts());
const UserService = new UserRepository(new Users());


module.exports = {
    ProductService,
    CartService,
    UserService,
};
