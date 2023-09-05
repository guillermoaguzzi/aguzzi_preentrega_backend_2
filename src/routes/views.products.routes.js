const { Router } = require("express");
const { authMdw } = require("../middleware/auth.middleware");
const { API_VERSION } = require("../config/config");


const productsModel = require("../models/products.models");

class ProductsViewsRoutes {
  path = "/view/products";
  router = Router();

  constructor() {
  this.initViewsRoutes();
  }

  initViewsRoutes() {
    this.router.get(`${this.path}`, /* authMdw, */ async (req, res) => {
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

      // Nuevo stage "match" si se proporciona el parámetro "stock"
      let stockFilter = null;

      if (stock === "true") {
        stockFilter = { stock: { $gte: 1 } };
      } else if (stock === "false") {
        stockFilter = { stock: { $lt: 1 } };
      }

      // Nuevo stage "sort" si se proporciona el parámetro "price"
      let sort = {};

      if (sortByPrice === -1) {
        sort = { price: -1 };
      } else if (sortByPrice === 1) {
        sort = { price: 1 };
      }

/*       if (stockFilter) {
        pipeline.push({ $match: stockFilter });
      } */

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

      // 2 paginas posteriores
      const followingPagesNumbers = [];

      if (totalPages - page >= 2) {
        for (let i = 0; i < 2; i++) {
          const followingPages = +page + i + 1;
          followingPagesNumbers.push(followingPages);
        }
      }

      previousPagesNumbers.sort((a, b) => a - b);

      // Primera y ultima pagina
      const firstPage = 1;
      const lastPage = totalPages;

      const firstPageExist = page >= 4 ? firstPage : null;
      const lastPageExist =
        followingPagesNumbers.length > 1 && totalPages - page >= 3
          ? lastPage
          : null;


          //variable para nombre en saludo "Welcome!"
          const userName = req.session.userName ? req.session.userName.charAt(0).toUpperCase() + req.session.userName.slice(1) : "";

          const userRol = req.session.userRol;


        res.render("products", {
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
          API_VERSION,
        });

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
