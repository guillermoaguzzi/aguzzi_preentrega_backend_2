/* const  cartDto = require ("../dto/cart.dto"); */
const cartsData = require("../db/carts.json");
const CartService = require ("../repository/carts.repository")
;

class CartCtrl {
    constructor() {
        this.cartService = new CartService();
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
            const cartInstDto = /* new cartDto */(req.body);
            const newCart = await this.cartService.createCart(cartInstDto);
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
            const updatedCart = await this.cartService.updateCartById(req.params.cid, cartData);

            if (typeof updatedCart === 'string') {
                return res.status(404).json({
                    message: `Product ID ${updatedCart} not found`,
                });
            }else if (updatedCart === undefined) {
                return res.status(404).json({
                    message: `cart ID ${req.params.cid} not found`,
                });
            } else {
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
        
        const quantity = req.body;
        
        try {
            const updatedProduct = await this.cartService.updateProductQuantity(req.params.cid, req.params.pid, quantity);

            if (!updatedProduct) {
                return res.status(404).json({
                    message: `cart ID ${req.params.cid} and/or product ID ${req.params.cid} not found`,
                });
                }
            
            return res.json({
                message: `Product ID ${req.params.pid} from cart ID ${req.params.cid} successfully updated`,
                cart: updatedProduct,
            });
            
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    };

    deleteProductById = async (req, res) => {
        console.log("deleteProductById from CONTROLLER executed");
        
        try {
            const deleteProduct = await this.cartService.deleteProductById(req.params.cid, req.params.pid);

            if (!deleteProduct) {
                return res.status(404).json({
                    message: `cart ID ${req.params.cid} and/or product ID ${req.params.cid} not found`,
                });
                }
            
            return res.json({
                message: `Product from cart ID ${req.params.cid} successfully deleted`,
            });
            
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
        const cartToDelete = await this.cartService.deleteCartById(req.params.cartId)
        
        if (!cartToDelete) {
            return res.status(404).json({
                message: `cart ID ${req.params.cartId} not found`,
            });
            }

        return res.json({
            message: `Cart successfully deleted`,
        })
        } catch (error) {
        return res.status(500).json({ message: error.message });
        }
    }
};

module.exports =  CartCtrl;