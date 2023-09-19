const cartModel = require("../models/carts.models");

class CartServiceDao {
    constructor(dao) {
        this.dao = dao;
    }

    insertCarts = async (cartsData) => {
        console.log("insertCarts from REPOSITORY executed");
        
        try {
            const carts = await cartModel.insertMany(cartsData);
            return carts;
        } catch (error) {
            console.log("🚀 ~ file: carts.repository.js:15 ~ CartServiceDao ~ insertCarts= ~ error:", error)
        }
    }

    getAllCarts = async () => {
        console.log("getAllCarts from REPOSITORY executed");

        try {
            const carts = await cartModel.find({});
            return carts;
        } catch (error) {
            console.log("🚀 ~ file: carts.repository.js:26 ~ CartServiceDao ~ getAllCarts= ~ error:", error)
        }
    };

    getCartById = async (cid) => {
        console.log("getCartById from REPOSITORY executed");

        try {
            const cart = await cartModel.findById({ _id: cid });
            return cart;
        } catch (error) {
            console.log("🚀 ~ file: carts.repository.js:37 ~ CartServiceDao ~ getCartById= ~ error:", error)
        }
    };

    createCart = async (cartData) => {
        console.log("CreateCart from REPOSITORY executed");

        try {
            const cart = await cartModel.create(cartData);
            console.log(cart);
            return cart;
        } catch (error) {
            console.log("🚀 ~ file: carts.repository.js:48 ~ CartServiceDao ~ CreateCart= ~ error:", error)
        }
    };

    updateCartById = async (cid, cartData) => {
        console.log("updateCartById from REPOSITORY executed");

        try {
            const data = await cartModel.updateOne({ _id: cid }, { $set: cartData });
            return data;
        } catch (error) {
        console.log("🚀 ~ file: carts.repository.js:59 ~ CartServiceDao ~ updateCartById= ~ error:", error)
        }
    };
    
    updateProductQuantity = async (cid, pid, quantity) => {
        console.log("updateProductQuantity from REPOSITORY executed");

        try {
            const cart = await cartModel.findById(cid);
            
            if (!cart) {
                throw new Error(`cart ID ${cid} not found`);
            }
        
            const productIndex = cart.products.findIndex(item => item.product.equals(pid));
            if (productIndex === -1) {
                throw new Error(`Product ID ${pid} not found`);
            }
            
            const quantityValue = quantity.quantity;
            cart.products[productIndex].quantity = quantityValue;
            const updatedCart = await cart.save();
            return updatedCart;
        } catch (error) {
            console.log("🚀 ~ file: carts.repository.js:83 ~ CartServiceDao ~ updateProductQuantity= ~ error:", error)
        }
    };

    deleteProductById = async (cid, pid) => {
        console.log("deleteProductById from REPOSITORY executed");

        try {
            const cart = await cartModel.findById(cid);
            
            if (!cart) {
                throw new Error(`cart ID ${cid} not found`);
            }
        
            const productIndex = cart.products.findIndex(item => item.product.equals(pid));
            if (productIndex === -1) {
                throw new Error(`Product ID ${pid} not found`);
            }
            
            cart.products.splice(productIndex, 1);
            const updatedCart = await cart.save();
            return updatedCart;
        } catch (error) {
            console.log("🚀 ~ file: carts.repository.js:106 ~ CartServiceDao ~ updateProductQuantity= ~ error:", error)
        }
    }

    deleteCartProductListById = async (cid) => {
        console.log("deleteCartProductListById from REPOSITORY executed");
    
        try {
            const cart = await cartModel.findById({ _id: cid });

            cart.products = [];
            const deletedCartList = await cart.save();
            return deletedCartList;
        } catch (error) {
        }
    };

    deleteCartById = async (cartId) => {
        console.log("deleteCartById from REPOSITORY executed");

        try {
        const delCart = await cartModel.deleteOne({ _id: cartId });
        return delCart;
        } catch (error) {
        }
    };
}

module.exports = CartServiceDao;