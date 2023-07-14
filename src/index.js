const App = require("./app")
const BaseRoute = require ("./routes/base.routes");
const CartsRoutes = require("./routes/carts.routes");
const ProductsRoutes = require("./routes/products.routes");
const FsCartsRoutes = require("./routes/fs.carts.routes");
const FsProductsRoutes = require("./routes/fs.products.routes");
const ProductsViewsRoutes = require("./routes/views.products.routes");
const CartsViewsRoutes = require("./routes/views.carts.routes");
const SessionRoutes = require("./routes/session.routes");


const app = new App([ new BaseRoute(), new CartsRoutes(), new ProductsRoutes(), new FsCartsRoutes(), new FsProductsRoutes(), new ProductsViewsRoutes(), new CartsViewsRoutes(), new SessionRoutes(), ]);

app.listen();