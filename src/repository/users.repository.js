const cartModel = require("../models/carts.models");
const CartService = require ("../repository/carts.repository");
const userModel = require("../models/users.model");
const MailingService = require ("../repository/mailing.repository");
const { authorization } = require("../middleware/auth.middleware");
const passport = require("passport");
const { passportCall } = require("../utils/jwt");
const { roleType } = require("../models/users.model");

class userService {
    constructor(dao) {
        this.dao = dao;
        this.mailingService = new MailingService();
        this.cartService = new CartService();
    }

    currentUser = async (req, res) => {
        console.log("currentUser from REPOSITORY executed");
    
        try {
            passportCall("jwt")(req, res, async () => {
                authorization(["USER", "ADMIN"])(req, res, () => {
                    
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

                const mappedUsers = users.map((user) => ({
                    _id: user._id,
                    Name: user.firstName + ' ' + user.lastName,
                    email: user.email,
                    cart: user.cart,
                    role: user.role
                }));

                return mappedUsers
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

    updateUserById = async (uid, userData, userToUpdatePreviousRole) => {
        console.log("updateUserById from REPOSITORY executed");

        try {

            const newRole = userData.role || null;

            const user = await userModel.findById(uid);
            const previousRole = userToUpdatePreviousRole ?? user.role;
            
            if(newRole === "ADMIN"){
                const userCartId = user.cart.toString();
                user.set('cart', undefined);
                await user.save();

                const cartToDelete = await cartModel.findById(userCartId);
                const deleteCart = await cartModel.deleteOne({ _id: userCartId });
            } else if(previousRole  === "ADMIN" && newRole){
                const newCart = await this.cartService.createCart();
                user.set('cart', newCart);
                await user.save();
            }
            
            const data = await userModel.updateOne({ _id: uid }, { $set: userData });

        return data;
        } catch (error) {
        console.log("🚀 ~ file: users.repository.js:68 ~ userServiceDao ~ updateUserById= ~ error:", error)
        }
    };

    deleteUserById = async (uid) => {
        console.log("deleteUserById from REPOSITORY executed");

        try {
            const user = await userModel.findById(uid);
            const cartToDelete = await cartModel.deleteOne({ _id: user.cart._id.toString()});
            const delUser = await userModel.deleteOne({ _id: uid });

            return delUser;
        } catch (error) {
        console.log("🚀 ~ file: users.repository.js:79 ~ userServiceDao ~ deleteUserById ~ error:", error)
        }
    };

    deleteInactiveUsers = async () => {
        console.log("deleteInactiveUsers from REPOSITORY executed");

        try {
            const users = await userModel.find({});
            const previousUserList = users;
            const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
    
            for (const user of users) {
                if(user.lastActivity < twoDaysAgo){
                    console.log("User's last activity greater than two days: ", user.lastActivity);
                    if(user.role !== "USER"){
                        console.log("User not deleted");
                    }
                } else {
                    console.log("User's last activity lesser than two days: ", user.lastActivity);
                    console.log("User not deleted");
                };
                console.log("--------------------------------------------------------------------");
                if (user.lastActivity < twoDaysAgo && user.role === "USER") {
                    await this.mailingService.sendEmail(user.email);
                    await cartModel.deleteOne({ _id: user.cart });
                    await userModel.deleteOne({ _id: user.id });
                    console.log("User deleted Succesfully");
                }
            }

            const activeUsers = users.filter((user) => user.lastActivity > twoDaysAgo || user.role !== "USER");
            if (JSON.stringify(users) === JSON.stringify(activeUsers)) {
                return null;
            } else {
                return users;
            }
        } catch (error) {
            console.log("🚀 ~ file: users.repository.js:79 ~ userServiceDao ~ deleteUserById ~ error:", error);
        }
    };

    
    
    
}



module.exports = userService;