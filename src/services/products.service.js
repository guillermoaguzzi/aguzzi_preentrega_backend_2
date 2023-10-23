const ProductDao = require("../Daos/products.Dao");
const { generateProducts } = require("../utils/mocks/generate.products");
const MailingService = require("./mailing.service");
const { EnumErrors, HttpResponse } = require("../middleware/errors.middleware");
const { StatusCodes } = require("http-status-codes");


class ProductService {
  constructor() {
    this.productDao = new ProductDao();
    this.mailingService = new MailingService();
    this.httpResp = new HttpResponse();
  }

  insertProducts = async (productsData) => {
    const products = await this.productDao.insertProducts(productsData);
    if (products === undefined) {
      throw new Error("Failed to insert products");
    }
    return products;
  }

  generateMockingProducts = async (productsData) => {
    const products = await this.productDao.generateMockingProducts(productsData);
    if (products === undefined) {
      throw new Error("Failed to generate mocking products");
    }
    return products;
  }

  getAllProducts = async () => {
    const products = await this.productDao.getAllProducts();
    if (products === undefined) {
      throw new Error("Failed to fetch products");
    }
    return products;
  };

  getProductById = async (pid) => {
    const product = await this.productDao.getProductById(pid);
    if (product === undefined) {
      throw new Error(`Product ID ${pid} not found`);
    }
    return product;
  };

  loggerTest = async (productId) => {
    const product = await this.productDao.loggerTest(productId);
    if (product === undefined) {
      throw new Error(`Product ID ${productId} not found`);
    }
    return product;
  };

  createProduct = async (req) => {
    const productData = req.body;
  
    const createdBy = {
      user: req.session.user._doc.email,
      role: req.session.user._doc.role
    };
  
    if (
      (!productData.title || typeof productData.title !== 'string') ||
      (!productData.description || typeof productData.description !== 'string') ||
      (!productData.code || typeof productData.code !== 'string') ||
      (!productData.category || typeof productData.category !== 'string') ||
      (!productData.price || typeof productData.price !== 'number') ||
      (!productData.stock || typeof productData.stock !== 'number') ||
      (!productData.status || typeof productData.status !== 'boolean')
    ) {
      return {
        success: false,
        status: StatusCodes.BAD_REQUEST,
        message: `${EnumErrors.INVALID_PARAMS} - Invalid Params for Product`,
      };
    }
  
    const codeCheck = await this.productDao.checkProductCode(productData.code);
    if (codeCheck) {
      return {
        success: false,
        status: StatusCodes.BAD_REQUEST,
        message: `${EnumErrors.DATABASE_ERROR} - Product code already exists`,
      };
    }
  
    productData.createdBy = createdBy;
  
    const product = await this.productDao.createProduct(productData);
  
    if (!product) {
      return {
        success: false,
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: 'Error creating product',
      };
    }
  
    return {
      success: true,
      status: StatusCodes.OK,
      message: 'Product created successfully',
      data: product,
    };
  };
  

  updateProductById = async (pid, productData) => {
    const data = await this.productDao.updateProductById(pid, productData);
    if (data === undefined) {
      throw new Error(`Product ID ${pid} not found`);
    }
    return data;
  };

  deleteProductById = async (pid) => {
    const product = await this.productDao.deleteProductById(pid);
    console.log("product: ", product);
    if (product.createdBy.role === "PREMIUM") {
      const emailAdress = product.createdBy.user;

      const emails = await this.mailingService.sendDeletedProductEmail(
        emailAdress,
        product
      );
      console.log(`Email successfully sent to ${emailAdress}`);
    }

    if (product === undefined) {
      throw new Error(`Product ID ${pid} not found`);
    }
    return product;
  };
}

module.exports = ProductService;
