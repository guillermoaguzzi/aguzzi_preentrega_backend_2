const { Router } = require("express");
const ProductCtrl = require("../controllers/products.controller");
const handlePolicies = require("../middleware/handle-policies.middleware");

class ProductsRoutes {
    constructor() {
        this.router = Router();
        this.productCtrl = new ProductCtrl();
        this.path = "/products";

        this.initRoutes();
    }

    initRoutes() {
        this.router.get(`${this.path}/insertion`, handlePolicies(["ADMIN"]), this.productCtrl.insertProducts);
        this.router.get(`${this.path}/mockingproducts`, handlePolicies(["ADMIN"]), this.productCtrl.generateMockingProducts);
        this.router.get(`${this.path}`, this.productCtrl.getAllProducts);
        this.router.get(`${this.path}/loggerTest`, this.productCtrl.loggerTest);
        this.router.get(`${this.path}/:pid`, this.productCtrl.getProductById);
        this.router.post(`${this.path}`, this.productCtrl.createProduct);
        this.router.put(`${this.path}/:pid`, handlePolicies(["ADMIN"]), this.productCtrl.updateProductById);
        this.router.delete(`${this.path}/:pid`, this.productCtrl.deleteProductById);
    }
}

module.exports = ProductsRoutes;
