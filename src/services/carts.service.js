const { format } = require('date-fns');
const ProductService = require("./products.service");
const CartDao = require("../daos/carts.dao");
const TicketsModel = require("../models/tickets.model");
const productModel = require("../models/products.models");
const { EnumErrors, HttpResponse } = require("../middleware/errors.middleware");
const { StatusCodes } = require("http-status-codes");

class CartService {
  constructor() {
    this.cartDao = new CartDao();
    this.productService = new ProductService();
    this.httpResp = new HttpResponse();
  }

  async insertCarts(cartsData) {
    console.log("insertCarts from SERVICE executed");
    return this.cartDao.insertCarts(cartsData);
  }

  async getAllCarts() {
    console.log("getAllCarts from SERVICE executed");
    return this.cartDao.getAllCarts();
  }

  async getCartById(cid) {
    console.log("getCartById from SERVICE executed");
    return this.cartDao.getCartById(cid);
  }

  async createCart(cartData) {
    console.log("createCart from SERVICE executed");
    return this.cartDao.createCart(cartData);
  }

  async purchaseCart(cart, email) {
    console.log("purchaseCart from SERVICE executed");
    const cartToPurchase = await this.cartDao.getCartById(cart);

    if (!cartToPurchase) {
      throw new Error(`Cart ID ${cart} not found`);
    }

    const ticketProducts = [];
    const productsWithoutStock = [];

    for (const { product, quantity } of cartToPurchase.products) {
      const productId = await this.productService.getProductById(product.id);
      if (productId.stock >= quantity) {
        ticketProducts.push({
          product,
          quantity,
        });
      } else {
        productsWithoutStock.push({ product, quantity });
      }
    }

    await this.cartDao.updateCartById(cartToPurchase.id, productsWithoutStock);

    await Promise.all(
      ticketProducts.map(async ({ product, quantity }) => {
        await productModel.updateOne(
          { _id: product._id },
          { $inc: { stock: -quantity } }
      );
      })
    );

    const ticketAmount = ticketProducts.reduce(
      (total, { product, quantity }) => {
        const price = parseFloat(product.price);
        const parsedQuantity = parseFloat(quantity);

        if (isNaN(price) || isNaN(parsedQuantity)) {
          throw new Error("Price and quantity must be valid numbers.");
        }

        return total + price * parsedQuantity;
      },
      0
    );

    const ticket = await TicketsModel.create({
      dateTime: format(new Date(), "dd-MM-yyyy HH:mm"),
      details: ticketProducts,
      amount: ticketAmount,
      purchasedBy: email,
    });

    return ticket;
  }

  async updateCartById(cid, cartData) {
    console.log("updateCartById from SERVICE executed");
    return await this.cartDao.updateCartById(cid, cartData);
  }

  async updateProductQuantity(cid, pid, quantity) {
    console.log("updateProductQuantity from SERVICE executed");
    
    const cart = await this.cartDao.getCartById(cid);
    if (!cart) {
      return {
        success: false,
        status: StatusCodes.BAD_REQUEST,
        message: `${EnumErrors.INVALID_PARAMS} - cart ID ${cid} not found `,
      };
    }

    const productIndex = cart.products.findIndex(item => item.product.equals(pid));
    if (productIndex === -1) {
      return {
        success: false,
        status: StatusCodes.BAD_REQUEST,
        message: `${EnumErrors.INVALID_PARAMS} - Product ID ${pid} not found inside cart ID ${cid}`,
      };
    }
  
    const quantityValue = quantity.quantity;
    if (!quantityValue) {
      return {
        success: false,
        status: StatusCodes.BAD_REQUEST,
        message: `${EnumErrors.INVALID_PARAMS} - Wrong format in request`,
      };
    }
    cart.products[productIndex].quantity = quantityValue;
    const updatedCart = await cart.save();
    if (!updatedCart) {
      return {
        success: false,
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: 'Error updating cart',
      };
    }
    
    return {
      success: true,
      status: StatusCodes.OK,
      message: `Product ID ${pid} quantity of ${quantityValue} successfully updated in cart ID ${cid} `,
      data: updatedCart,
    };
  }

  async deleteProductById(cid, pid) {
    console.log("deleteProductById from SERVICE executed");
    
    const cart = await this.cartDao.getCartById(cid);
    if (!cart) {
      return {
        success: false,
        status: StatusCodes.BAD_REQUEST,
        message: `${EnumErrors.INVALID_PARAMS} - cart ID ${cid} not found `,
      };
    }

    const productIndex = cart.products.findIndex(item => item.product.equals(pid));
    if (productIndex === -1) {
      return {
        success: false,
        status: StatusCodes.BAD_REQUEST,
        message: `${EnumErrors.INVALID_PARAMS} - Product ID ${pid} not found inside cart ID ${cid}`,
      };
    }
    
    cart.products.splice(productIndex, 1);
    const updatedCart = await cart.save();
    if (!updatedCart) {
      return {
        success: false,
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: 'Error deleting product from cart',
      };
    }
    
    return {
      success: true,
      status: StatusCodes.OK,
      message: `Product ID ${pid} successfully deleted from cart ID ${cid} `,
      data: updatedCart,
    };
  }

  async deleteCartProductListById(cid) {
    console.log("deleteCartProductListById from SERVICE executed");

    const cartData = [];
    const updatedCart = await this.cartDao.updateCartById(cid, cartData);
    return updatedCart ;
  }

  async deleteCartById(cartId) {
    console.log("deleteCartById from SERVICE executed");

    const cart = await this.cartDao.deleteCartById(cartId);
    if (cart.deletedCount <1) {
      return {
          success: false,
          status: StatusCodes.BAD_REQUEST,
          message: `${EnumErrors.DATABASE_ERROR} - Cart ID ${cartId} not found`,
      };
      }
    
      return {
        success: true,
        status: StatusCodes.OK,
        message: 'Cart deleted successfully',
        };
  }
}

module.exports = CartService;
