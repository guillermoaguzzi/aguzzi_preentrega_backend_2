const { Router } = require("express");

const cartsModel = require("../dao/models/carts.models");

const cartsData = require("../db/carts.json");
const CartManager = require("../dao/managers/carts.manager")

class CartsRoutes {
path = "/carts";
router = Router();
cartManager = new CartManager();

constructor() {
    this.initCartsRoutes();
}

  initCartsRoutes() {


    this.router.get(`${this.path}/insertion`, async (req, res) => {
      try {
          const carts = await cartsModel.insertMany(cartsData);
          return res.json({
          message: "GET: carts inserted successfully",
          cartsInserted: carts,
          });
      } catch (error) {
          console.log(
          "🚀 ~ file: carts.routes.js:29 ~ cartsRoutes ~ this.router.get ~ error:",
          error
          );
      }
      return res.status(400).json({ error: error.message });
      });
  

      this.router.get(`${this.path}`, async (req, res) => {
        try {
            const cartsArr = await this.cartManager.getAllCarts();
            return res.json({
            message: `GET: all carts succesfully fetched`,
            cartsLists: cartsArr,
            cartsAmount: cartsArr.length,
            });
        } catch (error) {
            console.log(
            "🚀 ~ file: carts.routes.js:47 ~ cartsRoutes ~ this.router.get ~ error:",
            error
            );
            return res.status(400).json({ error: error.message });
        }
        });


        this.router.get(`${this.path}/:cartId`, async (req, res) => {
          try {
              const { cartId } = req.params;
              const cartDetail = await this.cartManager.getCartById(cartId);
      
              if (!cartDetail) {
                  return res.json({
                      message: `GET: Cart ID ${cartId} not found`,
                  });
                  }
      
      
              return res.json({
                  message: `GET: Information of cart ID ${cartId} fetched succesfully`,
                  cart: cartDetail,
              });
          } catch (error) {
              console.log(
              "🚀 ~ file: carts.routes.js:73~ cartsRoutes ~ this.router.get ~ error:",
              error
              );
              return res.status(400).json({ error: error.message });
          }
          });



          this.router.post(`${this.path}`, async (req, res) => {
            try {
                const cartBody = req.body;
                const newCart = await this.cartManager.createCart(cartBody);
                if (!newCart) {
                return res.json({
                    message: `POST: Cart code ${cartBody.code} already exist`,
                });
                }
        
                return res.json({
                message: `POST: cart created successfully`,
                cart: newCart,
                });
            } catch (error) {
                console.log(
                "🚀 ~ file: carts.routes.js:98 ~ cartsRoutes ~ this.router.post ~ error:",
                error
                );
                return res.status(400).json({ error: error.message });
            }
            });


            this.router.put(`${this.path}/:cid`, async (req, res) => {
              try {

                  const { cid } = req.params;
                  const cartBody = req.body;

                  const updatedCart = await this.cartManager.updateCartProducts(cid, cartBody);

                  return res.json({
                  message: `PUT: cart updated successfully`,
                  cart: updatedCart,
                  });

              } catch (error) {
                  console.log(
                  "🚀 ~ file: carts.routes.js:121 ~ cartsRoutes ~ this.router.put ~ error:",
                  error
                  );
                  return res.status(400).json({ error: error.message });
              }
              });


              this.router.put(`${this.path}/:cid/products/:pid`, async (req, res) => {
                try {
  
                    const { cid, pid } = req.params;
                    const quantity = req.body;

  
                    const updatedCart = await this.cartManager.updateProductQuantity(cid, pid, quantity);
  
                    return res.json({
                    message: `PUT: Quantity on cart product updated successfully`,
                    cart: updatedCart,
                    });
  
                } catch (error) {
                    console.log(
                    "🚀 ~ file: carts.routes.js:145 ~ cartsRoutes ~ this.router.put ~ error:",
                    error
                    );
                    return res.status(400).json({ error: error.message });
                }
                });


              this.router.delete(`${this.path}/:cid/products/:pid`, async ( req, res ) => {
                try {

                  const { cid, pid } = req.params;
                  

                  const deletedProduct = await this.cartManager.deleteProduct(cid, pid);
                  
                  return res.json({
                    message: `DELETE: product deleted successfully in cart ${cid}`,
                    deletedProduct
                    });

                } catch (error) {
                  console.log(
                    "🚀 ~ file: carts.routes.js:168 ~ cartsRoutes ~ this.router.delete ~ error:",
                    error
                  );
                  return res.status(400).json({ error: error.message });
                }
              });


              this.router.delete(`${this.path}/:cid`, async (req, res) => {
                try {
  
                    const { cid } = req.params;
  
                    const deletedCartList = await this.cartManager.deleteCartProductList(cid);
  
                    return res.json({
                    message: `PUT: Product list in cart deleted successfully`,
                    cart: deletedCartList,
                    });
  
                } catch (error) {
                    console.log(
                    "🚀 ~ file: carts.routes.js:190 ~ cartsRoutes ~ this.router.delete ~ error:",
                    error
                    );
                    return res.status(400).json({ error: error.message });
                }
                });






    this.router.put(`${this.path}/:cartId`, async (req, res) => {
      return res.json({ message: `cart PUT` });
    });

    this.router.delete(`${this.path}/:cartId`, async (req, res) => {
      return res.json({ message: `cart DELETE` });
    });



    
  }
}

module.exports = CartsRoutes;
