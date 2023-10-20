const  ProductDto = require ("../dto/product.dto");
const productsData = require("../db/products.json");
const ProductService = require ("../repository/products.repository");
const handlePolicies = require("../middleware/handle-policies.middleware");

class ProductCtrl {
  constructor() {
    this.productService = new ProductService();
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

  loggerTest = async (req, res) => {
    console.log("getProductById from CONTROLLER executed");

    req.logger.info("DISMISS ALL CONSOLE OUTPUT - logger test ");
    req.logger.info("---------------------------------------- ");
    req.logger.debug("DEBUG level for Development Logger - console output CHECK ✓");
    req.logger.http("HTTP level for Development Logger - console output CHECK ✓");
    req.logger.info("INFO level for Development and production Logger - console output CHECK ✓");
    req.logger.warning("WARNING level for Development and production Logger - console output CHECK ✓");
    req.logger.error("ERROR level for Development and production Logger - console and file output CHECK ✓");
    req.logger.fatal("FATAL level for Development Logger for Development and production Logger - console and file ooutput CHECK ✓");

    try {
    const productId = "64f3568a564f7aa08e890d44"
    const product = await this.productService.loggerTest(productId);

    if (!product) {
      return res.status(404).json({
          message: `Product ID ${productId} not found`,
      });
      }

    return res.json({ message: `Product ID ${productId} successfully fetched`, product });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

  createProduct = async (req, res) => {
    console.log("createProduct from CONTROLLER executed");

    try {

      const userToken = req.session.token
            console.log(userToken);

            if (!userToken) {
                return res.status(401).json({ message: "User token not found" });
            }
    
            req.headers.authorization = `Bearer ${userToken}`;
    
            handlePolicies(["ADMIN","PREMIUM"])(req, res, async () => {
              const newProduct = await this.productService.createProduct(req, res);
        
              return res.json({
                message: `Product created successfully`,
                product: newProduct,
            });
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

      const productDeleted = await this.productService.deleteProductById(req.params.pid)
    
      if (!productDeleted) {
        return res.status(404).json({
            message: `Product ID ${req.params.pid} not found`,
        });
        }

      return res.json({
        message: `Product successfully deleted`, productDeleted,
      })
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
};

module.exports =  ProductCtrl;
