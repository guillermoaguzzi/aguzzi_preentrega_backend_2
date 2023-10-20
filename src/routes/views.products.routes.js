const { Router } = require("express");
const { authMdw } = require("../middleware/auth.middleware");
const { API_VERSION } = require("../config/config");
const CartService = require ("../repository/carts.repository");
const cartsModel = require("../models/carts.models");
const ProductService = require ("../repository/products.repository");
const productsModel = require("../models/products.models");

class ProductsViewsRoutes {
  path = "/view/products";
  router = Router();

  constructor() {
  this.initViewsRoutes();
  this.cartService = new CartService();
  this.productService = new ProductService();
  }

  initViewsRoutes() {
    this.router.get(`${this.path}`, authMdw, async (req, res) => {
      
      const limit = req.query.limit || 10;
      const category = req.query.category || null;
      const stock = req.query.stock || null;
      const sortOption = req.query.sortOption;
      const page = req.query.page || 1;
      const categories = [];
      const noCategory = null;
      const sortByPrice = parseInt(sortOption);

      const pipeline = [
        {
          $group: { _id: "$category" },
        },
      ];

      // new stage if "sort" is defined
      let stockFilter = null;

      if (stock === "true") {
        stockFilter = { stock: { $gte: 1 } };
      } else if (stock === "false") {
        stockFilter = { stock: { $lt: 1 } };
      }

      // new stage if "sort" is provided
      let sort = {};

      if (sortByPrice === -1) {
        sort = { price: -1 };
      } else if (sortByPrice === 1) {
        sort = { price: 1 };
      }


      const Productscategories = await productsModel.aggregate(pipeline);

      for (let i = 0; i < Productscategories.length; i++) {
        const categoriesValues = Productscategories[i]._id;
        categories.push(categoriesValues);
      }

      let query = {};

      if (category !== null) {
        query.category = category;
      }

      if (stockFilter) {
        query = { ...query, ...stockFilter };
      }

      const categoryURL = query.category;

      const {
        docs,
        hasPrevPage,
        hasNextPage,
        nextPage,
        prevPage,
        totalPages,
      } = await productsModel.paginate(query, { limit, page, sort, lean: true });

      // 2 paginas previas
      const previousPagesNumbers = [];

      if (page >= 3) {
        for (let i = 0; i < 2; i++) {
          const previousPages = +page - i - 1;
          previousPagesNumbers.push(previousPages);
        }
      }

      // following pages
      const followingPagesNumbers = [];

      if (totalPages - page >= 2) {
        for (let i = 0; i < 2; i++) {
          const followingPages = +page + i + 1;
          followingPagesNumbers.push(followingPages);
        }
      }

      previousPagesNumbers.sort((a, b) => a - b);

      // first and last page
      const firstPage = 1;
      const lastPage = totalPages;

      const firstPageExist = page >= 4 ? firstPage : null;
      const lastPageExist =
        followingPagesNumbers.length > 1 && totalPages - page >= 3
          ? lastPage: null;

          const userName = req.session.userName;
          const userRol = req.session.userRol;
          const userToken = req.session.token;
          const isUserAdmin = userRol === "ADMIN";
          const isUserNotAdmin = userRol !== "ADMIN";

          const renderElements =  {
            products: docs,
            categories,
            noCategory,
            categoryURL,
            limit,
            page,
            hasPrevPage,
            hasNextPage,
            prevPage,
            nextPage,
            totalPages,
            previousPagesNumbers,
            followingPagesNumbers,
            firstPage,
            lastPage,
            firstPageExist,
            lastPageExist,
            stock: req.query.stock,
            sortOption: req.query.sortOption,
            userName,
            userRol,
            userToken,
            isUserAdmin,
            isUserNotAdmin,
            API_VERSION,
          };

          if(req.session.userCart) {
            const cart = await cartsModel.findById({ _id: req.session.userCart });
            const productsFromCart = cart.products
            const formattedProducts = productsFromCart.map(item => {
              return {
                ...item.product._doc,
                quantity: item.quantity
              };
            });

            res.render("products", {...renderElements, formattedProducts })
          } else {
            res.render("products", renderElements)
          }

      const result = {
        status: "success",
        payload: docs,
        totalPages: totalPages,
        prevPage: prevPage,
        nextPage: nextPage,
        page: page,
        hasPrevPage: hasPrevPage,
        hasNextPage: hasNextPage,
        prevLink: hasPrevPage
          ? `/api/v1/view/products?limit=${limit}&page=${prevPage}&category=${category}`
          : null,
        nextLink: hasNextPage
          ? `/api/v1/view/products?limit=${limit}&page=${nextPage}&category=${category}`
          : null,
      };

    });









    
    this.router.post(`${this.path}`, authMdw, async (req, res) => {
      
      const userName = req.session.userName;
      const userRol = req.session.userRol;
      const userToken = req.session.token;
      const isUserAdmin = userRol === "ADMIN";
      const isUserNotAdmin = userRol !== "ADMIN";

      const limit = req.body.limit || 10;
      const category = req.body.category || null;
      const stock = req.body.stock || null;
      const sortOption = req.body.sortOption;
      const page = req.body.page || 1;
      const categories = [];
      const noCategory = null;
      const sortByPrice = parseInt(sortOption);


      const pipeline = [
        {
          $group: { _id: "$category" },
        },
      ];

      // new stage if "sort" is defined
      let stockFilter = null;

      if (stock === "true") {
        stockFilter = { stock: { $gte: 1 } };
      } else if (stock === "false") {
        stockFilter = { stock: { $lt: 1 } };
      }

      // new stage if "sort" is provided
      let sort = {};

      if (sortByPrice === -1) {
        sort = { price: -1 };
      } else if (sortByPrice === 1) {
        sort = { price: 1 };
      }


      const Productscategories = await productsModel.aggregate(pipeline);

      for (let i = 0; i < Productscategories.length; i++) {
        const categoriesValues = Productscategories[i]._id;
        categories.push(categoriesValues);
      }

      let query = {};

      if (category !== null) {
        query.category = category;
      }

      if (stockFilter) {
        query = { ...query, ...stockFilter };
      }

      const categoryURL = query.category;


      // Adding products to Cart
      let cartID = "";
      let units = req.body.units;
      let productToAdd = req.body.productToAdd;
      let productAlreadyInCart = false;
      let productIdfull = []
      let productId = []
      let productNotAdded = false;
      

      if (productToAdd) {
        if(isUserAdmin){
          productNotAdded = true;
        } else {
        cartID = req.session.user._doc.cart;
        const cartToFind = await cartsModel.findById({ _id: cartID });
        const cartToUpdateData = cartToFind.products

        for (const productItem of cartToUpdateData) {
          productIdfull.push(productItem.product._id);
          productId.push(productItem.product._id.toString());
        }

          for (const productIdValue of productId) {
            if (productToAdd === productIdValue) {
            const productIndexProductIdValue = productId.indexOf(productIdValue);
            const productIndex = cartToUpdateData.findIndex(item => item.product._id.equals(productIdfull[productIndexProductIdValue]));
            cartToFind.products[productIndex].quantity = parseInt(cartToFind.products[productIndex].quantity) + parseInt(units);
            await cartToFind.save();
            units = "";
            productToAdd = "";
            productAlreadyInCart = true;
          }
        }
        if(!productAlreadyInCart){
        const productToUpdateData = await productsModel.findById({ _id: productToAdd });
        const productToUpdate = {
          product: productToAdd,
          quantity: parseInt(units)
        };
        cartToFind.products.push(productToUpdate);
        await cartToFind.save();
        }
      }
      };


      // Updating product Quantity in Cart
      let changeQuantity = req.body.changeQuantity;
      let productToUpdate = req.body.productToUpdate;

      if (productToUpdate) {

        const cid = req.session.user._doc.cart;
        const pid = productToUpdate;
        const quantity = {
          "quantity": parseInt(changeQuantity)
        };
        await this.cartService.updateProductQuantity(cid, pid, quantity);
      };

            // Deleting product in Cart
            let productToDelete = req.body.productToDelete;
      
            if (productToDelete && !productToUpdate) {
              const cid = req.session.user._doc.cart;
              const pid = productToDelete;
              await this.cartService.deleteProductById(cid, pid);
            };

      const {
        docs,
        hasPrevPage,
        hasNextPage,
        nextPage,
        prevPage,
        totalPages,
      } = await productsModel.paginate(query, { limit, page, sort, lean: true });

      // 2 paginas previas
      const previousPagesNumbers = [];

      if (page >= 3) {
        for (let i = 0; i < 2; i++) {
          const previousPages = +page - i - 1;
          previousPagesNumbers.push(previousPages);
        }
      }

      // following pages
      const followingPagesNumbers = [];

      if (totalPages - page >= 2) {
        for (let i = 0; i < 2; i++) {
          const followingPages = +page + i + 1;
          followingPagesNumbers.push(followingPages);
        }
      }

      previousPagesNumbers.sort((a, b) => a - b);

      // first and last page
      const firstPage = 1;
      const lastPage = totalPages;

      const firstPageExist = page >= 4 ? firstPage : null;
      const lastPageExist =
        followingPagesNumbers.length > 1 && totalPages - page >= 3
          ? lastPage: null;

          const renderElements =  {
            products: docs,
            categories,
            noCategory,
            categoryURL,
            limit,
            page,
            hasPrevPage,
            hasNextPage,
            prevPage,
            nextPage,
            totalPages,
            previousPagesNumbers,
            followingPagesNumbers,
            firstPage,
            lastPage,
            firstPageExist,
            lastPageExist,
            stock: req.query.stock,
            sortOption: req.query.sortOption,
            userName,
            userRol,
            userToken,
            isUserAdmin,
            isUserNotAdmin,
            productNotAdded,
            API_VERSION,
          };

          if(req.session.userCart) {
            const cart = await cartsModel.findById({ _id: req.session.userCart });
            const productsFromCart = cart.products
            const formattedProducts = productsFromCart.map(item => {
              return {
                ...item.product._doc,
                quantity: item.quantity
              };
            });

            res.render("products", {...renderElements, formattedProducts })
          } else {
            res.render("products", renderElements)
          }

      const result = {
        status: "success",
        payload: docs,
        totalPages: totalPages,
        prevPage: prevPage,
        nextPage: nextPage,
        page: page,
        hasPrevPage: hasPrevPage,
        hasNextPage: hasNextPage,
        prevLink: hasPrevPage
          ? `/api/v1/view/products?limit=${limit}&page=${prevPage}&category=${category}`
          : null,
        nextLink: hasNextPage
          ? `/api/v1/view/products?limit=${limit}&page=${nextPage}&category=${category}`
          : null,
      };

    });
  }
}

module.exports = ProductsViewsRoutes;
