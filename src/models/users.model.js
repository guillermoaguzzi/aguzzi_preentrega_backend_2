const mongoose = require("mongoose");

const collectionName = "Users";

/* const roleType = {
  USER: "USER",
  ADMIN: "ADMIN",
  PUBLIC: "PUBLIC",
}; */

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
  role: {
    type: String,
    required: true,
    enum: ["USER", "ADMIN", "PUBLIC"],
    default: "USER",
  },
});

const userModel = mongoose.model(collectionName, userSchema);
module.exports = userModel;
