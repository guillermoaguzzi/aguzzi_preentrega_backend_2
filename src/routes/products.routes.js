const { Router } = require("express");
const ProductCtrl = require("../controllers/products.controller");


class ProductsRoutes {
    constructor() {
        this.router = Router();
        this.productCtrl = new ProductCtrl();
        this.path = "/products";

        this.initRoutes();
    }

    initRoutes() {
        this.router.get(`${this.path}/insertion`, this.productCtrl.insertProducts);
        this.router.get(`${this.path}`, this.productCtrl.getAllProducts);
        this.router.get(`${this.path}/:pid`, this.productCtrl.getProductById);
        this.router.post(`${this.path}`, this.productCtrl.createProduct);
        this.router.put(`${this.path}/:pid`, this.productCtrl.updateProductById);
        this.router.delete(`${this.path}/:pid`, this.productCtrl.deleteProductById);
    }
}

module.exports = ProductsRoutes;
