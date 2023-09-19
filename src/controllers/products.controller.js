const  ProductDto = require ("../dto/product.dto");
const productsData = require("../db/products.json");
const {ProductService} = require ("../repository/repository.index");



class ProductCtrl {
  constructor() {
    this.productService = ProductService;
  }

  insertProducts = async (req, res ) => {
    console.log("insertProducts from CONTROLLER executed");
    
    try {
      const products = await this.productService.insertProducts(productsData);
      return res.json({ message: `All products successfully inserted from file system`, products});
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  generateMockingProducts = async (req, res ) => {
    console.log("generateMockingProducts from CONTROLLER executed");
    
    try {
      const products = await this.productService.generateMockingProducts(productsData);
      return res.json({ message: `All mock products successfully generated`, products});
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  getAllProducts = async (req, res) => {
    console.log("getAllProducts from CONTROLLER executed");

    try {
      const products = await this.productService.getAllProducts();
      return res.json({ message: `All products successfully fetched`, products});
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };

  getProductById = async (req, res) => {
      console.log("getProductById from CONTROLLER executed");

      try {
      const product = await this.productService.getProductById(req.params.pid);

      if (!product) {
        return res.status(404).json({
            message: `Product ID ${req.params.pid} not found`,
        });
        }

      return res.json({ message: `Product ID ${req.params.pid} successfully fetched`, product });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };

  createProduct = async (req, res) => {
    console.log("createProduct from CONTROLLER executed");

    try {
      const productInstDto = /* new ProductDto */(req.body);
      const newProduct = await this.productService.createProduct(
        productInstDto
      );
      return res.json({
        message: `Product created successfully`,
        product: newProduct,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };

  updateProductById = async (req, res) => {
    console.log("updateProductById from CONTROLLER executed");

    const productData = req.body;
    
    try {
      const UpdatedProduct = await this.productService.updateProductById(req.params.pid, productData);

      if (!UpdatedProduct) {
        return res.status(404).json({
            message: `Product ID ${req.params.pid} not found`,
        });
        }
    
      return res.json({
        message: `Product ID ${req.params.pid} successfully updated`,
        Product: UpdatedProduct,
      });
      
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };

  deleteProductById = async (req, res) => {
    console.log("deleteProductById from CONTROLLER executed");
    
    try {
      const productToDelete = await this.productService.deleteProductById(req.params.pid)
    
      //Could become a helper (see code line 40 and 77)
      if (!productToDelete) {
        return res.status(404).json({
            message: `Product ID ${req.params.pid} not found`,
        });
        }

      return res.json({
        message: `Product successfully deleted`,
      })
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
};

module.exports =  ProductCtrl;
