const cartsData = require("../db/carts.json");
const CartService = require ("../services/carts.service");
const ProductService = require ("../services/products.service");
const { HttpResponse } = require("../middleware/errors.middleware");
const { EnumErrors } = require("../middleware/errors.middleware");
const { StatusCodes } = require("http-status-codes");

class CartCtrl {
    constructor() {
        this.productService = new ProductService();
        this.cartService = new CartService();
        this.httpResp = new HttpResponse();
    }

    insertCarts = async (req, res ) => {
        console.log("insertCarts from CONTROLLER executed");
        
        try {
            const carts = await this.cartService.insertCarts(cartsData);
            return res.json({ message: `All carts successfully inserted from file system`, carts});
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    getAllCarts = async (req, res) => {
        console.log("getAllCarts from CONTROLLER executed");

        try {
            const carts = await this.cartService.getAllCarts();
            return res.json({ message: `All carts successfully fetched`, carts});
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    };

    getCartById = async (req, res) => {
        console.log("getCartById from CONTROLLER executed");

        try {
            const cart = await this.cartService.getCartById(req.params.cid);

            if (!cart) {
                return res.status(404).json({
                    message: `cart ID ${req.params.cid} not found`,
                });
                }

            return res.json({ message: `cart ID ${req.params.cid} successfully fetched`, cart });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    };

    createCart = async (req, res) => {
        console.log("createCart from CONTROLLER executed");

        try {
            const newCart = await this.cartService.createCart(req.body);
            return res.json({
                message: `Cart created successfully`,
                cart: newCart,
            });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    };

    purchaseCart = async (req, res) => {
        console.log("purchaseCart from CONTROLLER executed");

        try {
            const {cart, email} = req.session.user._doc;

            const ticket = await this.cartService.purchaseCart(cart, email);
            return res.json({
                message: `Ticket generated successfully`,
                data: ticket,
            });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    };

    updateCartById = async (req, res) => {
        console.log("updateCartById from CONTROLLER executed");

        const cartData = req.body;
        try {
            const cartToUpdate = await this.cartService.getCartById(req.params.cid);

            if (!cartToUpdate) {
                return res.status(404).json({
                    message: `cart ID ${req.params.cid} not found`,
                });
            }

            for (const item of cartData) {
                const product = await this.productService.getProductById(item.product);
    
                if (!product) {
                    return res.status(404).json({
                        message: `Product ID ${item.product} not found`,
                    });
                }
            }
            
            const updatedCart = await this.cartService.updateCartById(req.params.cid, cartData);

            if(updatedCart === undefined){
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    message: `${EnumErrors.CONTROLLER_ERROR} - ${error.message}`,
                });
            }else {
                console.log("updatedCart: ", updatedCart);
            return res.json({
                message: `cart ID ${req.params.cid} successfully updated`,
                cart: updatedCart,
                });
            }
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    };


    updateProductQuantity = async (req, res) => {
        console.log("updateProductQuantity from CONTROLLER executed");
        
        try {
            const response = await this.cartService.updateProductQuantity(req.params.cid, req.params.pid, req.body);

            switch (response.status) {
                case StatusCodes.BAD_REQUEST:
                    return this.httpResp.BadRequest(res, response.message);
                case StatusCodes.INTERNAL_SERVER_ERROR:
                    return this.httpResp.Error(res, response.message);
                case StatusCodes.OK:
                    return res.json({
                    message: response.message,
                    cart: response.data,
                    });
                default:
                    return this.httpResp.Error(res, response.message);
            }
            
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    };

    deleteProductById = async (req, res) => {
        console.log("deleteProductById from CONTROLLER executed");
        
        try {
            const response = await this.cartService.deleteProductById(req.params.cid, req.params.pid);

            switch (response.status) {
                case StatusCodes.BAD_REQUEST:
                    return this.httpResp.BadRequest(res, response.message);
                case StatusCodes.OK:
                    return res.json({
                    message: response.message,
                    });
                default:
                    return this.httpResp.Error(res, response.message);
            }
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    };

    deleteCartProductListById = async (req, res) => {
        console.log("deleteCartProductListById from CONTROLLER executed");
        
        try {
        const listToDelete = await this.cartService.deleteCartProductListById(req.params.cid)
        
        if (!listToDelete) {
            return res.status(404).json({
                message: `cart ID ${req.params.cid} not found`,
            });
            }

        return res.json({
            message: `Products list from cart ID ${req.params.cid} successfully deleted`,
        })
        } catch (error) {
        return res.status(500).json({ message: error.message });
        }
    }

    deleteCartById = async (req, res) => {
        console.log("deleteCartById from CONTROLLER executed");
        
        try {
        const response = await this.cartService.deleteCartById(req.params.cartId)
        
        switch (response.status) {
            case StatusCodes.BAD_REQUEST:
              return this.httpResp.BadRequest(res, response.message);
            case StatusCodes.OK:
              return res.json({
                message: response.message,
                product: response.data,
              });
            default:
              return this.httpResp.Error(res, response.message);
          }
      } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          message: `${EnumErrors.CONTROLLER_ERROR} - ${error.message}`,
        });
      }
    };
};

module.exports =  CartCtrl;