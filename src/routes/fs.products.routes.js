const { Router } = require("express");
const fs = require('fs');
const path = require('path');
const { postSchema, putSchema } = require("../utils/fs.validator");

class FsProductsRoutes{
path = "/fs/products";
router = Router();
pathProducts = path.join(__dirname, '../db/fs/products.json');

constructor() {
	this.initFsProductsRoutes();
}

	initFsProductsRoutes() {
		const router = this.router;
		const pathProducts  = this.pathProducts;

// "(...) La ruta raíz GET / deberá listar todos los productos de la base. (Incluyendo la limitación ?limit del desafío anterior (...)" (consignas.txt:6)
this.router.get(`${this.path}/`, async (req, res) => {
	try {
		const data = await fs.promises.readFile(pathProducts, 'utf-8');
		const products = JSON.parse(data);

		const limit = req.query.limit;
		if (limit) {
			const limitedProducts = products.slice(0, limit);
			res.send(limitedProducts);
		} else {
			res.send(products);
		}
	} catch (error) {
		console.log(
			"🚀 ~ file: fs.products.routes.js:33 ~ productsRoutes ~ this.router.get ~ error:",
			error
			);
/* 	console.error('Failed reading file', error);
	res.status(500).json({ error: 'Failed reading file' }); */
	}
});


// "(...) La ruta GET /:pid deberá traer sólo el producto con el id proporcionado  (...)" (consignas.txt:7)
this.router.get(`${this.path}/:pid`, async (req, res) => {
	try {
		const data = await fs.promises.readFile(pathProducts, 'utf-8');
		const products = JSON.parse(data);
	
		const { pid } = req.params;
		const productById = products.find((product) => product.id == pid);
		if (productById) return res.json(productById);
		res.status(404).json({ error: "Product not found" });
	} catch (error) {
	console.error('Failed reading file', error);
	res.status(500).json({ error: 'Failed reading file' });
	}
});


// "(...) La ruta raíz POST / deberá agregar un nuevo producto con los campos  (...)" (consignas.txt:9)
this.router.post(`${this.path}/`, async (req, res) => {
	try {
		const data = await fs.promises.readFile(pathProducts, 'utf-8');
		const products = JSON.parse(data);

		const { error, value } = postSchema.validate(req.body);
		if (error) {
			res.status(400).json({ error: error.details[0].message });
		} else {
			const { title, description, code, price, status, stock, category, thumbnails } = value;
		// "(...) el id NO se manda desde body, se autogenera (...)" (consignas.txt:10)
		const ids = products.map(product => product.id);
		const id = Math.max(...ids) + 1;
		const productNew = { id, title, description, code, price, status, stock, category, thumbnails };
		products.push(productNew);
		await fs.promises.writeFile(pathProducts,JSON.stringify(products,null,'\t') )
		res.status(201).json(productNew);
    }
	} catch (error) {
		console.error('Failed reading file', error);
		res.status(500).json({ error: 'Failed reading file' });
	}
});


// "(...) La ruta PUT /:pid deberá tomar un producto y actualizarlo  (...)" (consignas.txt:22)
this.router.put(`${this.path}/:pid`, async (req, res) => {
	try {
	const data = await fs.promises.readFile(pathProducts, 'utf-8');
	let products = JSON.parse(data);

	const { pid } = req.params;
	const productUpdated = products.find((product) => product.id == pid);
	if (productUpdated) {
	const { error, value } = putSchema.validate(req.body);
	if (error) {
		res.status(400).json({ error: error.details[0].message });
	} else {
		Object.assign(productUpdated, value);
		await fs.promises.writeFile(pathProducts, JSON.stringify(products, null, '\t'));
		return res.json(productUpdated);
	}
	} else {
	res.status(404).json({ error: "Product not found" });
	}
} catch (error) {
	console.error('Failed reading file', error);
	res.status(500).json({ error: 'Failed reading file' });
}
});


// "(...) La ruta DELETE /:pid deberá eliminar el producto con el pid indicado  (...)" (consignas.txt:24)
this.router.delete(`${this.path}/:pid`, async (req, res) => {
	try {
		const data = await fs.promises.readFile(pathProducts, 'utf-8');
		const products = JSON.parse(data);
		
		const { pid } = req.params;
		const productDeleted = products.find((product) => product.id == pid );
		if (productDeleted) {
			products.splice(products.indexOf(productDeleted), 1);
			await fs.promises.writeFile(pathProducts, JSON.stringify(products, null, '\t'));
			return res.sendStatus(204);
		}
		res.status(404).json({ error: "Product not found" });
	} catch (error) {
		console.error('Failed reading file', error);
		res.status(500).json({ error: 'Failed reading file' });
}
});
}
}

module.exports = FsProductsRoutes;