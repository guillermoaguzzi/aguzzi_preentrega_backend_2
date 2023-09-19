const mongoose = require("mongoose");

const collectionName = "Users";

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  username: {
    type: String,
    required: true,
    index:true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    index:true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "cart"
  },
/*   cart: {
    type: [
      {
        cart: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "cart",
        },
      },
    ], 
  },*/
  role: {
    type: String,
    required: true,
    enum: ["USER", "ADMIN", "PUBLIC"],
    default: "USER",
  },
});

/* userSchema.pre(["find", "findOne"], function () {
  this.populate({
    path: "cart.cart",
    options: { strictPopulate: false }
  });
}); */


const userModel = mongoose.model(collectionName, userSchema);
module.exports = userModel;
