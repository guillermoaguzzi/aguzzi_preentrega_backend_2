const mongoose = require('mongoose');
const mongoosePaginate = require("mongoose-paginate-v2");

const productCollection = "products";

const productsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
    index:true,
    unique: true,
  },
  price: {
    type: Number,
    required: true,
  },
  status: {
    type: Boolean,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  createdBy: {
    user: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["ADMIN", "PREMIUM"],
    }
  }
});


productsSchema.plugin(mongoosePaginate);
const productModel = mongoose.model(productCollection, productsSchema);
module.exports = productModel;