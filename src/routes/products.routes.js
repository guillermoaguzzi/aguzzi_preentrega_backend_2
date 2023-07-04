const { Router } = require("express");

const productsModel = require("../dao/models/products.models");

const productsData = require("../db/products");
const ProductManager = require("../dao/managers/products.manager");

class ProductsRoutes {
path = "/products";
router = Router();
productManager = new ProductManager();

constructor() {
    this.initProductsRoutes();
}

initProductsRoutes() {
    this.router.get(`${this.path}/insertion`, async (req, res) => {
    try {
        const products = await productsModel.insertMany(productsData);
        return res.json({
        message: "GET: products inserted successfully",
        productsInserted: products,
        });
    } catch (error) {
        console.log(
        "🚀 ~ file: products.routes.js:27 ~ productsRoutes ~ this.router.get ~ error:",
        error
        );
    }
    });

/*     this.router.get(`${this.path}/:page`, async (req, res) => {
    try {
        const productsArr = await this.productManager.getAllProducts();
        return res.json({
        message: `GET: all products succesfully fetched`,
        productsLists: productsArr,
        productsAmount: productsArr.length,
        });
    } catch (error) {
        console.log(
        "🚀 ~ file: products.routes.js:43 ~ productsRoutes ~ this.router.get ~ error:",
        error
        );
    }
    }); */


    this.router.get(`${this.path}`, async (req, res) => {
        try {
            const productsArr = await this.productManager.getAllProducts();
            return res.json({
            message: `GET: all products succesfully fetched`,
            productsLists: productsArr,
            productsAmount: productsArr.length,
            });
        } catch (error) {
            console.log(
            "🚀 ~ file: products.routes.js:43 ~ productsRoutes ~ this.router.get ~ error:",
            error
            );
        }
        });

    this.router.get(`${this.path}/:productId`, async (req, res) => {
    try {
        const { productId } = req.params;
        const productDetail = await this.productManager.getProductById(productId);

        if (!productDetail) {
            return res.json({
                message: `GET: Product ID ${productId} not found`,
            });
            }


        return res.json({
            message: `GET: Information of product ID ${productId} fetched succesfully`,
            product: productDetail,
        });
    } catch (error) {
        console.log(
        "🚀 ~ file: products.routes.js:59 ~ productsRoutes ~ this.router.get ~ error:",
        error
        );
    }
    });

    this.router.post(`${this.path}`, async (req, res) => {
    try {
        const productBody = req.body;
        const newProduct = await this.productManager.createProduct(productBody);
        if (!newProduct) {
        return res.json({
            message: `POST: Product code ${productBody.code} already exist`,
        });
        }

        return res.json({
        message: `POST: Product created successfully`,
        product: newProduct,
        });
    } catch (error) {
        console.log(
        "🚀 ~ file: products.routes.js:81 ~ productsRoutes ~ this.router.post ~ error:",
        error
        );
    }
    });

    this.router.put(`${this.path}/:productId`, async (req, res) => {
        try {
            const productId = req.params.productId;
            const bodyProduct = req.body;
            
            try {
            const updatedProduct = await this.productManager.updateProduct(
                productId,
                bodyProduct
            );
            
            return res.json({
                message: `PUT: Product updated successfully`,
                product: updatedProduct,
            });
            } catch (error) {
            res.status(400).json({ error: error.message });
            }
        } catch (error) {
            console.log(
            "🚀 ~ file: products.routes.js:79 ~ productsRoutes ~ this.router.put ~ error:",
            error
            );
            res.status(500).json({ error: "Internal server error" });
        }
        });


        this.router.delete(`${this.path}/:productId`, async (req, res) => {
            try {
                const { productId } = req.params;
                const productDeleted = await this.productManager.deleteProductById(productId);
        
                if (!productDeleted) {
                    return res.json({
                        message: `DELETE: Product ID ${productId} not found`,
                    });
                    }
        
        
                return res.json({
                    message: `DELETE: Product ID ${productId} deleted succesfully`,
                });
            } catch (error) {
                console.log(
                "🚀 ~ file: products.routes.js:140 ~ productsRoutes ~ this.router.delete ~ error:",
                error
                );
            }
            });

}
}

module.exports = ProductsRoutes;
