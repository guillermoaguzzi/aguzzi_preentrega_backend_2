const cartsModel = require("../models/carts.models");
const productsModel = require("../models/products.models");




class cartManager {
  getAllCarts = async () => {
    try {
      const cartsArr = await cartsModel.find({}).populate("products.product");
      return cartsArr;
    } catch (error) {
      console.log(
        "🚀 ~ file: carts.routes.js:10 ~ cartsRoutes ~ this.router.get ~ error:",
        error
      );
    }
  };


  getCartById = async (id) => {
    try {
      return await cartsModel.findById({ _id: id }).populate("products.product");
    } catch (err) {
      console.log(
        "🚀 ~ file: carts.manager.js:24 ~ cartsManager ~ getCartById= ~ err:",
        err
      );
    }
  };


  createCart = async (cartBody) => {
    try {
      const newCart = await cartsModel.create({
        ...cartBody
      });

      return newCart;
    } catch (error) {
      console.log(
        "🚀 ~ file: carts.manager.js:45 ~ cartsManager ~ createCarts=async ~ error:",
        error
      );
    }
  };


  updateCartProducts = async (cid, cartBody) => {
    try {
      const cart = await cartsModel.findById({ _id: cid });
      if (!cart) {
        throw new Error("Cart not found");
      }
  
      for (const product of cartBody) {
        const foundProduct = await productsModel.findById(product.product);
        if (!foundProduct) {
          throw new Error(`Product not found: ${product.product}`);
        }
  
        cart.products.push({
          product: product.product,
          quantity: product.quantity,
        });
      }
  
      const updatedCart = await cart.save();
  
      return updatedCart;
    } catch (error) {
      console.error("Error updating cart", error);
      throw error;
    }
  };
  

  updateProductQuantity = async (cid, pid, quantity) => {
    try {
      const cart = await cartsModel.findById(cid);
      if (!cart) {
        throw new Error("Cart not found");
      }
  
      const productIndex = cart.products.findIndex(item => item.product.equals(pid));
      if (productIndex === -1) {
        throw new Error(`Product not found: ${pid}`);
      }

      const quantityValue = quantity.quantity;

      cart.products[productIndex].quantity = quantityValue;
  
      const updatedCart = await cart.save();
  
      return updatedCart;
    } catch (error) {
      console.error("Error updating product quantity in cart:", error);
      throw error;
    }
  }  


  deleteProduct = async (cid, pid) => {
    try {
      const cart = await cartsModel.findById(cid);
      if (!cart) {
        throw new Error("Cart not found");
      }
  
      const productIndex = cart.products.findIndex(item => item.product.equals(pid));
      if (productIndex === -1) {
        throw new Error(`Product not found: ${pid}`);
      }
  
      cart.products.splice(productIndex, 1);
  
      const updatedCart = await cart.save();
  
      return updatedCart;
    } catch (error) {
      console.error("Error deleting product from cart:", error);
      throw error;
    }
  }


  deleteCartProductList = async (cid) => {
    try {
      const cart = await cartsModel.findById(cid);
      if (!cart) {
        throw new Error("Cart not found");
      }
  
      cart.products = [];
  
      const deletedCartList = await cart.save();
  
      return deletedCartList;
    } catch (error) {
      console.error("Error deleting products from cart:", error);
      throw error;
    }
  }
  
}



module.exports = cartManager;