const App = require("./app");
const CartsRoutes = require("./routes/carts.routes");
const ProductsRoutes = require("./routes/products.routes");
const SessionRoutes = require("./routes/sessions.routes");
const UsersRoutes = require("./routes/users.routes");
const MailingRoutes = require("./routes/mailing.routes");
const ProductsViewsRoutes = require("./routes/views.products.routes");
const CartsViewsRoutes = require("./routes/views.carts.routes");
const TicketViewsRoutes = require("./routes/views.ticket.routes");
const UsersManagerViewsRoutes = require("./routes/views.usersManager.routes");


const app = new App([
  new CartsRoutes(),
  new ProductsRoutes(),
  new SessionRoutes(),
  new UsersRoutes(),
  new MailingRoutes(),
  new ProductsViewsRoutes(),
  new CartsViewsRoutes(),
  new TicketViewsRoutes(),
  new UsersManagerViewsRoutes(),
]);

app.listen();
