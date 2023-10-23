const cartsModel = require("../models/carts.models");

class CartDao {
  constructor() {}

  async insertCarts(cartsData) {
    return cartsModel.insertMany(cartsData);
  }

  async getAllCarts() {
    return cartsModel.find({});
  }

  async getCartById(cid) {
    return cartsModel.findById(cid);
  }

  async createCart(cartData) {
    return cartsModel.create(cartData);
  }

  async updateCartById(cid, cartData) {
    return cartsModel.findByIdAndUpdate(cid, { products: cartData }, { new: true });
  }

  async deleteCartById(cartId) {
    return cartsModel.deleteOne({ _id: cartId });
  }
}

module.exports = CartDao;
