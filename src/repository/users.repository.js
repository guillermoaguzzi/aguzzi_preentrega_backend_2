const userModel = require("../models/users.model");
const { authorization } = require("../middleware/auth.middleware");
const passport = require("passport");
const { passportCall } = require("../utils/jwt");
const { roleType } = require("../models/users.model");

class userServiceDao {
    constructor(dao) {
        this.dao = dao;
    }

    currentUser = async (req, res) => {
        console.log("currentUser from REPOSITORY executed");
    
        try {
            passportCall("jwt")(req, res, async () => {
                authorization(["USER", "ADMIN"])(req, res, () => {
                    return res.send(req.user);
                });
            });
        } catch (error) {
            console.log("🚀 ~ file: users.repository.js:22 ~ userServiceDao ~ currentUser= ~ error:", error)
        }
    }    

    getAllUsers = async (req, res) => {
        console.log("getAllUsers from REPOSITORY executed");

        try {
                const users = await userModel.find({});
                
                return users
        } catch (error) {
        console.log("🚀 ~ file: users.repository.js:34 ~ userServiceDao ~ getAllUsers= ~ error:", error)
        }
    };

    getUserById = async (uid) => {
        console.log("getUserById from REPOSITORY executed");

        try {
            const user = await userModel.findById(uid);

            return user;
        } catch (error) {
        console.log("🚀 ~ file: users.repository.js:46 ~ userServiceDao ~ getUserById= ~ error:", error)
        }
    };

    createUser = async (userData) => {
        console.log("createUser from REPOSITORY executed");

        try {
            const user = await userModel.create(userData);
            return user;
        } catch (error) {
        console.log("🚀 ~ file: users.repository.js:57 ~ userServiceDao ~ createUser= ~ error:", error)
        }
    };

    updateUserById = async (uid, userData) => {
        console.log("updateUserById from REPOSITORY executed");

        try {
        const data = await userModel.updateOne({ _id: uid }, { $set: userData });
        return data;
        } catch (error) {
        console.log("🚀 ~ file: users.repository.js:68 ~ userServiceDao ~ updateUserById= ~ error:", error)
        }
    };

    deleteUserById = async (uid) => {
        console.log("deleteUserById from REPOSITORY executed");

        try {
            const delUser = await userModel.deleteOne({ _id: uid });
            return delUser;
        } catch (error) {
        console.log("🚀 ~ file: users.repository.js:79 ~ userServiceDao ~ deleteUserById ~ error:", error)
        }
    };

}

module.exports = userServiceDao;