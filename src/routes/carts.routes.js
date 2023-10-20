const { Router } = require("express");
const CartCtrl = require("../controllers/carts.controller");
const handlePolicies = require("../middleware/handle-policies.middleware");


class CartsRoutes {
  constructor() {
    this.router = Router();
    this.cartCtrl = new CartCtrl();
    this.path = "/carts";

    this.initCartsRoutes();
  }

  initCartsRoutes() {
    this.router.get(`${this.path}/insertion`, this.cartCtrl.insertCarts);
    this.router.get(`${this.path}`, this.cartCtrl.getAllCarts);
    this.router.get(`${this.path}/:cid`, this.cartCtrl.getCartById);
    this.router.post(`${this.path}`, this.cartCtrl.createCart);
    this.router.post(`/purchase/`, this.cartCtrl.purchaseCart);
    this.router.put(`${this.path}/:cid`, handlePolicies(["USER", "ADMIN"]), this.cartCtrl.updateCartById);
    this.router.put(`${this.path}/:cid/products/:pid`, this.cartCtrl.updateProductQuantity);
    this.router.delete(`${this.path}/:cid/products/:pid`, this.cartCtrl.deleteProductById);
    this.router.delete(`${this.path}/:cid`, this.cartCtrl.deleteCartProductListById);
    this.router.delete(`${this.path}/delete/:cartId`, this.cartCtrl.deleteCartById);
  }
}

module.exports = CartsRoutes;
