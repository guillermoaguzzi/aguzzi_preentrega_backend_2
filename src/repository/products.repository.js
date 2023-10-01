const productModel = require("../models/products.models");
const { generateProducts } = require("../utils/mocks/generate.products");
const { EnumErrors, HttpResponse } = require("../middleware/errors.middleware");

  class ProductServiceDao {
  constructor(dao) {
    this.dao = dao;
    this.httpResp = new HttpResponse();
  }

  insertProducts = async (productsData) => {
    console.log("insertProducts from REPOSITORY executed");
    
    try {
      const products = await productModel.insertMany(productsData);
      return products;
    } catch (error) {
      console.log("🚀 ~ file: products.repository.js:16 ~ ProductServiceDao ~ insertProducts= ~ error:", error)
    }
  }

  generateMockingProducts = async (productsData) => {
    console.log("generateMockingProducts from REPOSITORY executed");
    
    try {
      let products = [];
      for (let index = 0; index < 100; index++) {
        products.push(generateProducts());
      }
    
      return products
    } catch (error) {
      console.log("🚀 ~ file: products.repository.js:31 ~ ProductServiceDao ~ insertProducts= ~ error:", error)
    }
  }

  getAllProducts = async () => {
    console.log("getAllProducts from REPOSITORY executed");

    try {
      const products = await productModel.find({});
      return products;
    } catch (error) {
    console.log("🚀 ~ file: products.repository.js:42 ~ ProductServiceDao ~ getAllProducts= ~ error:", error)
    }
  };

  getProductById = async (pid) => {
    console.log("getProductById from REPOSITORY executed");

    try {
      const product = await productModel.findById({ _id: pid });
      return product;
    } catch (error) {
    console.log("🚀 ~ file: products.repository.js:53 ~ ProductServiceDao ~ getProductById= ~ error:", error)
    }
  };

  loggerTest = async (productId) => {
    console.log("getProductById from REPOSITORY executed");

    try {
      const product = await productModel.findById({ _id: productId });
      return product;

    } catch (error) {
    console.log("🚀 ~ file: products.repository.js:67 ~ ProductServiceDao ~ loggerTest= ~ error:", error)
    }
  };

  createProduct = async (productData, res) => {
    console.log("createProduct from REPOSITORY executed");

    try {
      if (
        (!productData.title || typeof productData.title !== 'string') ||
        (!productData.description || typeof productData.description !== 'string') ||
        (!productData.code || typeof productData.code !== 'string') ||
        (!productData.category || typeof productData.category !== 'string') ||
        (!productData.price || typeof productData.price !== 'number') ||
        (!productData.stock || typeof productData.stock !== 'number') ||
        (!productData.status || typeof productData.status !== 'boolean')
      ) {
        return this.httpResp.BadRequest(
          res,
          `${EnumErrors.INVALID_PARAMS} - Invalid Params for Product `,
          productData
        );
      }

      const codeCheck = await productModel.findOne({ code: productData.code });
      console.log(codeCheck)
      if (codeCheck) {
        return this.httpResp.BadRequest(
          res,
          `${EnumErrors.DATABASE_ERROR} - Product code already exist`,
          productData.code
        );
      }

      const product = await productModel.create(productData);
      return product;
    } catch (error) {
        return this.httpResp.Error(
          res,
          `Error creating product`,
          error?.message
        );
      }
  };

  updateProductById = async (pid, productData) => {
    console.log("getProductById from REPOSITORY executed");

    try {
      const data = await productModel.updateOne({ _id: pid }, { $set: productData });
      return data;
    } catch (error) {
    console.log("🚀 ~ file: products.repository.js:75 ~ ProductServiceDao ~ updateProductById= ~ error:", error)
    }
  };

  deleteProductById = async (pid) => {
    console.log("deleteProductById from REPOSITORY executed");

    try {
      const delProd = await productModel.deleteOne({ _id: pid });
      return delProd;
    } catch (error) {
    console.log("🚀 ~ file: products.repository.js:86 ~ ProductServiceDao ~ deleteProductById ~ error:", error)
    }
  };
}

module.exports = ProductServiceDao;