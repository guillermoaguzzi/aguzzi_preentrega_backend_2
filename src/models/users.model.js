const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

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
    ref: "cart",
  },
  role: {
    type: String,
    required: true,
    enum: ["ADMIN", "PREMIUM", "USER", "PUBLIC"],
    default: "USER",
  },
  lastActivity: {
    type: Date,
    default: Date.now,
  },
});

/* userSchema.pre(["find", "findOne"], function () {
  this.populate({
    path: "cart.cart",
    options: { strictPopulate: false }
  });
}); */

userSchema.plugin(mongoosePaginate);
const userModel = mongoose.model(collectionName, userSchema);
module.exports = userModel;
