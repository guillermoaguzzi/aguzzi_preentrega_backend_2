const { mongoose } = require("mongoose");
const { DB_HOST, DB_PORT, DB_NAME, PERSISTENCE } = require("../config/config");
const ProductsServiceDao = require("../repository/products.repository");
const CartsServiceDao = require("../repository/carts.repository");
const UsersServiceDao = require("../repository/users.repository");
const SessionServiceDao = require("../repository/sessions.repository");

const MONGO_URL = `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`;

class Products {
  constructor(){
    let products;
  }
}

class Carts {
  constructor(){
    let carts;
  }
}

class Users {
  constructor(){
    let users;
  }
}

class Sessions {
  constructor(){
    let sessions;
  }
}

(async () => {
  switch (PERSISTENCE) {
    case "MONGO":
      console.log(`Persistence ${PERSISTENCE}`);
      try {
        const connection = await mongoose.connect(MONGO_URL);
        console.log("Connected to MongoDB");
        Products = ProductsServiceDao;
        Carts = CartsServiceDao;
        Users = UsersServiceDao;
        Sessions = SessionServiceDao;
      } catch (err) {
        console.error("Error connecting to MongoDB:", err);
      }
      break;

    default:
      console.log(`PERSISTENCE ${PERSISTENCE}`);
      try {
        console.log("Connected to fs file system");
        Products = ProductsServiceDaoMemory;
        Carts = CartsServiceDaoMemory;
        Users = UsersServiceDaoMemory;
        Sessions = SessionServiceDaoMemory;
      } catch (err) {
        console.error("Error importing ProductServiceDaoMemory:", err);
      }
      break;
  }
})();

module.exports = {
  Products, 
  Carts,
  Users,
  Sessions,
}
