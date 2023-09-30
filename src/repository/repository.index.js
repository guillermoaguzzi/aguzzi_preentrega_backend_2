const { Products } = require("../dao/factory");
const ProductRepository = require("./products.repository");
const { Carts } = require("../dao/factory");
const CartRepository = require("./carts.repository");
const { Users } = require("../dao/factory");
const UserRepository = require("./users.repository");
const { Sessions } = require("../dao/factory");
const SessionRepository = require("./sessions.repository");


const ProductService = new ProductRepository(new Products());
const CartService = new CartRepository(new Carts(), ProductService);
const UserService = new UserRepository(new Users());
const SessionService = new SessionRepository(new Sessions(), CartService);


module.exports = {
    ProductService,
    CartService,
    UserService,
    SessionService,
};