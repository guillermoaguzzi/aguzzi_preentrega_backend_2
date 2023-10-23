const userModel = require("../models/users.models");

class UserDao {
    async getAllUsers() {
        return userModel.find({});
    }

    async getUserById(uid) {
        return userModel.findById(uid);
    }

    async createUser(userData) {
        return userModel.create(userData);
    }

    async usernameEmailcheck(checkElement) {
        return userModel.findOne({ $or: [{ username: checkElement }, { email: checkElement }] });
    }

    async updateUserById(uid, userData) {
        console.log("aqui aqui")
        return userModel.updateOne({ _id: uid }, { $set: userData });
    }

    async deleteUserById(uid) {
        return userModel.deleteOne({ _id: uid });
    }

}

module.exports = UserDao;
