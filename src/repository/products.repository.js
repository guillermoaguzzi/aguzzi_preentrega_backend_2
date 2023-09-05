const productModel = require("../models/products.models");

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
      console.log("🚀 ~ file: products.repository.js:15 ~ ProductServiceDao ~ insertProducts= ~ error:", error)
    }
  }

  getAllProducts = async () => {
    console.log("getAllProducts from REPOSITORY executed");

    try {
      const products = await productModel.find({});
      return products;
    } catch (error) {
    console.log("🚀 ~ file: products.repository.js:26 ~ ProductServiceDao ~ getAllProducts= ~ error:", error)
    }
  };

  getProductById = async (pid) => {
    console.log("getProductById from REPOSITORY executed");

    try {
      const product = await productModel.findById({ _id: pid });
      return product;
    } catch (error) {
    console.log("🚀 ~ file: products.repository.js:37 ~ ProductServiceDao ~ getProductById= ~ error:", error)
    }
  };

  createProduct = async (productData) => {
    console.log("createProduct from REPOSITORY executed");

    try {
      const product = await productModel.create(productData);
      return product;
    } catch (error) {
    console.log("🚀 ~ file: products.repository.js:48 ~ ProductServiceDao ~ createProduct= ~ error:", error)
    }
  };

  updateProductById = async (pid, productData) => {
    console.log("getProductById from REPOSITORY executed");

    try {
      const data = await productModel.updateOne({ _id: pid }, { $set: productData });
      return data;
    } catch (error) {
    console.log("🚀 ~ file: products.repository.js:59 ~ ProductServiceDao ~ updateProductById= ~ error:", error)
    }
  };

  deleteProductById = async (pid) => {
    console.log("deleteProductById from REPOSITORY executed");

    try {
      const delProd = await productModel.deleteOne({ _id: pid });
      return delProd;
    } catch (error) {
    console.log("🚀 ~ file: products.repository.js:71 ~ ProductServiceDao ~ deleteProductById ~ error:", error)
    }
  };
}

module.exports = ProductServiceDao;