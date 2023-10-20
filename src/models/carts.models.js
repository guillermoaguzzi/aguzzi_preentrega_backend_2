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

cartsSchema.pre(["find", "findOne"], function () {
  this.populate({
    path: "products.product",
    options: { strictPopulate: true }
  });
});


const cartsModel = mongoose.model(cartsCollection, cartsSchema);
module.exports = cartsModel;