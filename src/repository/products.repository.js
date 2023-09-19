const productModel = require("../models/products.models");
const { generateProducts } = require("../utils/mocks/generate.products");

  class ProductServiceDao {
  constructor(dao) {
    this.dao = dao;
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

  createProduct = async (productData) => {
    console.log("createProduct from REPOSITORY executed");

    try {
      const product = await productModel.create(productData);
      return product;
    } catch (error) {
    console.log("🚀 ~ file: products.repository.js:64 ~ ProductServiceDao ~ createProduct= ~ error:", error)
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