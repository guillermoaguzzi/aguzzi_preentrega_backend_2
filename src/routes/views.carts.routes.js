const { Router } = require("express");
const cartModel = require("../dao/models/carts.models")

class CartsViewsRoutes{
    path = '/view/cart'
    router = Router();

    constructor() {
        this.initViewsRoutes();
    }

    initViewsRoutes() {
                this.router.get(`${this.path}/:cartId`, async (req, res) => {
                    try {
                      const { cartId } = req.params;
                      const cartDetail = await cartModel.findById(cartId).populate("products.product");
                  
                      if (!cartDetail) {
                        return res.json({
                          message: `GET: Product ID ${cartId} not found`,
                        });
                      }
                  
                      const products = [];

                        for (const productData of cartDetail.products) {
                        const { product, quantity } = productData;
                        const { title, price } = product;
                        const totalPrice = price * quantity;
                        products.push({ title, price, quantity, totalPrice });
                        }
                  
                      return res.render("carts", { products });
                    } catch (error) {
                      console.log("Error fetching cart details:", error);
                      return res.status(500).json({ error: "Internal server error" });
                    }
                  });
                  

                }
            }

module.exports = CartsViewsRoutes;