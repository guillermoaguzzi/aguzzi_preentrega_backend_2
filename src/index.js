const App = require("./app");
const CartsRoutes = require("./routes/carts.routes");
const ProductsRoutes = require("./routes/products.routes");
const FsCartsRoutes = require("./routes/fs/fs.carts.routes");
const FsProductsRoutes = require("./routes/fs/fs.products.routes");
const ProductsViewsRoutes = require("./routes/views.products.routes");
const CartsViewsRoutes = require("./routes/views.carts.routes");
const SessionRoutes = require("./routes/sessions.routes");
const UsersRoutes = require("./routes/users.routes");
const MailingRoutes = require("./routes/mailing.routes");

const app = new App([
  new CartsRoutes(),
  new ProductsRoutes(),
  new FsCartsRoutes(),
  new FsProductsRoutes(),
  new ProductsViewsRoutes(),
  new CartsViewsRoutes(),
  new SessionRoutes(),
  new UsersRoutes(),
  new MailingRoutes(),
]);

app.listen();
