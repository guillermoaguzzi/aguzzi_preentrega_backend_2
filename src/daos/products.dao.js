const productModel = require("../models/products.models");

class ProductDao {
  constructor() {}

  async insertProducts(productsData) {
    return await productModel.insertMany(productsData);

  }

  async generateMockingProducts() {
    let products = [];
    for (let index = 0; index < 100; index++) {
      // Genera productos de prueba según sea necesario.
    }
    return products;
  }

  async getAllProducts() {
    return await productModel.find({});
  }

  async getProductById(pid) {
    return await productModel.findById(pid);
  }

  async checkProductCode(code) {
    return await productModel.findOne({ code: code });
  }

  async createProduct(productData) {
    return await productModel.create(productData);
  }

  async updateProductById(pid, productData) {
    return await productModel.updateOne({ _id: pid }, { $set: productData });
  }

  async deleteProductById(pid) {
    const product = await productModel.findById(pid);
    if (product.createdBy.role === "PREMIUM") {
      // Enviar correo electrónico si es necesario.
    }
    await productModel.deleteOne({ _id: pid });
    return product;
  }

  // Agrega otras funciones del DAO según sea necesario.
}

module.exports = ProductDao;
