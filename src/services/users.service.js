const userDao = require('../daos/users.dao');
const cartDao = require("../daos/carts.dao");
const CartService = require ("./carts.service");
const userModel = require("../models/users.models");
const MailingService = require ("./mailing.service");
const { authorization } = require("../middleware/auth.middleware");
const passport = require("passport");
const { passportCall } = require("../utils/jwt");
const { roleType } = require("../models/users.models");
const { EnumErrors, HttpResponse } = require("../middleware/errors.middleware");
const { StatusCodes } = require("http-status-codes");

class userService {
    constructor(dao) {
        this.userDao = new userDao();
        this.cartDao = new cartDao();
        this.mailingService = new MailingService();
        this.cartService = new CartService();
        this.httpResp = new HttpResponse();
    }

    currentUser = async (req, res) => {
        console.log("currentUser from REPOSITORY executed");
    
        passportCall("jwt")(req, res, async () => {
            authorization(["USER", "ADMIN"])(req, res, () => {
                // Lógica aquí
            });
        });
    }

    getAllUsers = async (req, res) => {
        console.log("getAllUsers from REPOSITORY executed");
        
        const users = await this.userDao.getAllUsers();

        return users.map((user) => ({
            _id: user._id,
            name: user.firstName + ' ' + user.lastName,
            email: user.email,
            cart: user.cart || null,
            role: user.role
        }));
    };

    getUserById = async (uid) => {
        console.log("getUserById from REPOSITORY executed");
        return await this.userDao.getUserById(uid);
    };

    createUser = async (userData) => {
        console.log("createUser from REPOSITORY executed");

        console.log(userData)
        if (
            (!userData.firstName || typeof userData.firstName !== 'string') ||
            (!userData.lastName || typeof userData.lastName !== 'string') ||
            (!userData.age || typeof userData.age !== 'number') ||
            (!userData.username || typeof userData.username !== 'string') ||
            (!userData.email || typeof userData.email !== 'string') ||
            (!userData.password || typeof userData.password !== 'string')
        ) {
            return {
            success: false,
            status: StatusCodes.BAD_REQUEST,
            message: `${EnumErrors.INVALID_PARAMS} - Invalid Params for user`,
            };
        }

        const usernameCheck = await this.userDao.usernameEmailcheck(userData.username);
        if (usernameCheck) {
        return {
            success: false,
            status: StatusCodes.BAD_REQUEST,
            message: `${EnumErrors.DATABASE_ERROR} - Username already exists - try another one`,
        };
        }
        
        const emailCheck = await this.userDao.usernameEmailcheck(userData.email);
        if (emailCheck) {
        return {
            success: false,
            status: StatusCodes.BAD_REQUEST,
            message: `${EnumErrors.DATABASE_ERROR} - Email already exists - try another one`,
        };
        }

        if (userData.role !== "ADMIN") {
            const cart = await this.cartDao.createCart();
            userData = { ...userData, cart: cart._id}
        }

        const user = await this.userDao.createUser(userData);

        if (!user) {
        return {
            success: false,
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            message: 'Error creating user',
        };
        }
    
        return {
        success: true,
        status: StatusCodes.OK,
        message: 'User created successfully',
        data: user,
        };
    };


    updateUserById = async (uid, userData, userToUpdatePreviousRole) => {
        console.log("updateUserById from REPOSITORY executed");

        const newRole = userData.role || null;
        if (newRole !== null && !["ADMIN", "PREMIUM", "USER", "PUBLIC"].includes(newRole)) {
            return {
                success: false,
                status: StatusCodes.BAD_REQUEST,
                message: `${EnumErrors.INVALID_PARAMS} - Invalid input Data`,
            };
        }

        if (!userData.firstName || !userData.lastName || !userData.age || !userData.username || !userData.email || !userData.password || !userData.role) {
            return {
            success: false,
            status: StatusCodes.BAD_REQUEST,
            message: `${EnumErrors.INVALID_PARAMS} - Invalid input Data`,
            };
        }

        const user = await this.userDao.getUserById(uid);
        const previousRole = userToUpdatePreviousRole ?? user.role;
        if (newRole === "ADMIN") {
            const userCartId = user.cart.toString();
            user.set('cart', undefined);
            await user.save();
            await this.cartDao.deleteCartById({ _id: userCartId });
        } else if (previousRole === "ADMIN" && newRole) {
            const newCart = await this.cartDao.createCart();
            user.set('cart', newCart);
            await user.save();
        }

        const updatedUser = await this.userDao.updateUserById(uid, userData);
        
        if (!updatedUser) {
            return {
                success: false,
                status: StatusCodes.INTERNAL_SERVER_ERROR,
                message: 'Error updating user',
            };
            }
        
            return {
            success: true,
            status: StatusCodes.OK,
            message: 'User updated successfully',
            data: updatedUser,
            };
    };

    deleteUserById = async (uid) => {
        console.log("deleteUserById from REPOSITORY executed");

        const user = await this.userDao.getUserById(uid);
        if (!user) {
            return {
                success: false,
                status: StatusCodes.BAD_REQUEST,
                message: `${EnumErrors.DATABASE_ERROR} - User ID ${uid} not found`,
            };
            }

            console.log("user: ", user)
        if(user.cart){
            await this.cartDao.deleteCartById({ _id: user.cart._id.toString() });
        }

        const deletedUser = await this.userDao.deleteUserById({ _id: uid });

        if (!deletedUser) {
            return {
                success: false,
                status: StatusCodes.INTERNAL_SERVER_ERROR,
                message: 'Error deleting user',
            };
            }
        
            return {
            success: true,
            status: StatusCodes.OK,
            message: 'User deleted successfully',
            };
    };

    deleteInactiveUsers = async () => {
        console.log("deleteInactiveUsers from REPOSITORY executed");
        const users = await this.userDao.getAllUsers();
        const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
    
        const data = await Promise.all(users.map(async (user) => {
            const email = user.email;
            const activity =
                user.lastActivity < twoDaysAgo
                    ? `User's last activity greater than two days: ${user.lastActivity}`
                    : `User's last activity lesser than two days: ${user.lastActivity}`;
            let action = "";
    
            if (user.lastActivity < twoDaysAgo && user.role === "USER") {
                await this.mailingService.sendEmail(user.email);
                await this.cartDao.deleteCartById({ _id: user.cart });
                await this.userDao.deleteUserById({ _id: user.id });
                action = "User deleted. Email sent";
            } else if (user.role !== "USER") {
                action = `User not deleted due to role ${user.role}`;
            } else {
                action = "User not deleted due to activity";
            }
    
            return {
                email,
                activity,
                action
            };
        }));
    
        const activeUsers = users.filter(user => user.lastActivity > twoDaysAgo || user.role !== "USER");
        return data

    };
    
}

module.exports = userService;
