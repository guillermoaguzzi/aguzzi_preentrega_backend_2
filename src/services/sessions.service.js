const userModel = require("../models/users.models")
const { createHashValue, isValidPasswd } = require("../utils/bcrypt");
const passport = require("passport");
const { generateJWT } = require("../utils/jwt");
const CartService = require ("./carts.service");

class SessionService {
    constructor() {
        this.cartService = new CartService();
    }

    registerUser = async (req, res) => {
        console.log("registerUser from REPOSITORY executed");

        try {
            const firstName = req.body.firstName ?? req.params.firstName ?? req.firstName;
            const lastName = req.body.lastName ?? req.params.lastName;
            const age = req.body.age ?? req.params.age;
            const username = req.body.username ?? req.params.username;
            const email = req.body.email ?? req.params.email;
            const role = req.body.role || "USER";
            const pswHashed = await createHashValue(req.body.password ?? req.params.password);

            const findUser = await userModel.findOne({ $or: [{ username }, { email }] });

            if (findUser) {
                return res.status(409).json({ message: "username and/or email already exist" });
            }

            let newUserData;
            
            if (role === "USER") {
                let cartData = {};
                const newCart = await this.cartService.createCart(cartData);
    
                newUserData = {
                    firstName,
                    lastName,
                    age,
                    username,
                    email,
                    password: pswHashed,
                    cart: newCart._id,
                    role
                };
            } else {
                newUserData = {
                    firstName,
                    lastName,
                    age,
                    username,
                    email,
                    password: pswHashed,
                    role
                };
            }
            
            const newUser = await userModel.create(newUserData);
    
            console.log(req.session)
            req.session.user = { ...newUserData };
            return newUserData.email
        } catch (error) {
        console.log("🚀 ~ file: users.service.js:65 ~ sessionServiceDao ~ registerUser= ~ error:", error)
        }
    }

    loginUser = async (req, res) => {
        console.log("loginUser from REPOSITORY executed");
    
        try {

            const usernameEmail = req.body.usernameEmail ?? req.body.email ?? req.body.username;
            const password = req.body.password;
    
            const findUserUsernameEmail = await userModel.findOne({ $or: [{ username: usernameEmail }, { email: usernameEmail }] });

            if (!findUserUsernameEmail) {
                return null;
            }
    
            const isValidComparePsw = await isValidPasswd(password, findUserUsernameEmail.password);
    
            if (!isValidComparePsw) {
                return undefined;
            }
    
            findUserUsernameEmail.lastActivity = new Date();
            await findUserUsernameEmail.save();

            
            const signUser = {
                email: findUserUsernameEmail.email,
                role: findUserUsernameEmail.role,
                id: findUserUsernameEmail._id,
            };
            
            const token = await generateJWT({ ...signUser });
            
            req.session.user = {...findUserUsernameEmail, password: "",};
            req.session.email = findUserUsernameEmail.email;
            req.session.userName = findUserUsernameEmail.firstName + " " + findUserUsernameEmail.lastName;
            if(findUserUsernameEmail.cart) {
                req.session.userCart = findUserUsernameEmail.cart;
            };
            req.session.userRol = findUserUsernameEmail.role;
            req.session.token = token;

            const user = {
                email: findUserUsernameEmail.email,
                role: findUserUsernameEmail.role,
                token: token,
            };

            return user
        } catch (error) {
            console.log("🚀 ~ file: users.service.js:80 ~ sessionServiceDao ~ loginUser= ~ error:", error);
            res.status(500).json({ message: error.message });
        }
    }
    

    logoutUser = async (req, res) => {
        console.log("logoutUser from REPOSITORY executed");

        try {
            req.session.destroy((err) => {
                if (!err) {
                    console.log("User successfully logged out");
                } else {
                    res.status(500).json({ message: "Logout Error", body: err });
                }
            });
        } catch (error) {
            throw error;
        }
    }
}

module.exports = SessionService;