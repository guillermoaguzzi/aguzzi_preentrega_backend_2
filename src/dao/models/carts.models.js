const mongoose = require("mongoose");

const cartsCollection = 'carts';

const cartsSchema = new mongoose.Schema({
  products: {
    type: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "products"
        },
        quantity: {
          type: Number
        }
      }
    ],
    default: []
  }
});

cartsSchema.pre("find", function () {
  this.populate({
    path: "products.product",
    options: { strictPopulate: false }
  });
});

const cartsModel = mongoose.model(cartsCollection, cartsSchema);
module.exports = cartsModel;
