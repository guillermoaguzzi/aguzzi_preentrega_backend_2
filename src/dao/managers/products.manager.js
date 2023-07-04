const productsModel = require("../models/products.models");

class productManager {


  getAllProducts = async () => {
    try {
      const productsArr = await productsModel.find({});
      return productsArr;
    } catch (error) {
      console.log(
        "🚀 ~ file: products.routes.js:42 ~ productsRoutes ~ this.router.get ~ error:",
        error
      );
    }
  };

  getProductById = async (id) => {
    try {
      const productDetail = await productsModel.findById({ _id: id });

      return productDetail;
    } catch (error) {
      console.log(
        "🚀 ~ file: product.manager.js:22 ~ productManager ~ getProductById= ~ error:",
        error
      );
    }
  };

  createProduct = async (bodyProduct) => {
    try {
      const productDetail = await productsModel.findOne({
        code: bodyProduct.code,
      });
      if (productDetail && Object.keys(productDetail).length !== 0) {
        return null;
      }

      const newProduct = await productsModel.create(bodyProduct);
      // TODO: Manejar el error o si pasa algo mientras creo el documento de estudiante

      return newProduct;
    } catch (error) {
      console.log(
        "🚀 ~ file: product.manager.js:42 ~ productManager ~ createProduct= ~ error:",
        error
      );
    }
  };


  updateProduct = async (productId, bodyProduct) => {
    try {
      const product = await productsModel.findOne({ _id: productId });
  
      if (!product) {
        return null;
      }
  
      const fieldsToUpdate = Object.keys(bodyProduct);
  
      const schemaProperties = Object.keys(productsModel.schema.paths);
  
      for (const field of fieldsToUpdate) {
        if (!schemaProperties.includes(field)) {
          throw new Error(`🚀 ~ file: product.manager.js:66 ~ productManager ~ updateProduct= ~ error: Field '${field}' does not exist in the product`);
        }
  
        const fieldValue = bodyProduct[field];
        const fieldSchemaType = productsModel.schema.path(field).instance;
        if (typeof fieldValue !== fieldSchemaType.toLowerCase()) {
          throw new Error(
            `🚀 ~ file: product.manager.js:73 ~ productManager ~ updateProduct= ~ error: Invalid value '${fieldValue}' for field '${field}'. Expected type '${fieldSchemaType}'`
          );
        }
      }
  
      Object.assign(product, bodyProduct);
  
      const updatedProduct = await product.save();
  
      return updatedProduct;
    } catch (error) {
      console.log("🚀 ~ error:", error);
      throw error;
    }
  };


  deleteProductById = async (id) => {
    try {
      const productDeleted = await productsModel.deleteOne({ _id: id });
  
      if (productDeleted.deletedCount === 0) {
        return null; // Producto no encontrado
      }
  
      return productDeleted;
    } catch (error) {
      console.log(
        "🚀 ~ file: product.manager.js:100 ~ productManager ~ deleteProductById ~ error:",
        error
      );
      throw error;
    }
  };
  
  
  
}

module.exports = productManager;
