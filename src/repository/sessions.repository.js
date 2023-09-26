const userModel = require("../models/users.model")
const { createHashValue, isValidPasswd } = require("../utils/bcrypt");
const passport = require("passport");
const { generateJWT } = require("../utils/jwt");
const {CartService} = require ("../repository/repository.index");


class SessionServiceDao {
    constructor(dao, CartService) {
        this.dao = dao;
        this.cartService = CartService;
    }

    registerUser = async (req, res) => {

        try {
            const firstName = req.body.firstName ?? req.params.firstName;
            const lastName = req.body.lastName ?? req.params.lastName;
            const age = req.body.age ?? req.params.age;
            const username = req.body.username ?? req.params.username;
            const email = req.body.email ?? req.params.email;
            const role = req.body.role ?? req.params.role;
            const pswHashed = await createHashValue(req.body.password ?? req.params.password);

            const findUser = await userModel.findOne({ $or: [{ username }, { email }] });

            if (findUser) {
                return res.status(409).json({ message: "username and/or email already exist" });
            }

            let cartData = {};
            const newCart = await this.cartService.createCart(cartData);
            console.log(newCart);

            const newUserData = {
                firstName,
                lastName,
                age,
                username,
                email,
                password: pswHashed,
                cart: newCart._id,
                role
            };

            const newUser = await userModel.create(newUserData);
    
            req.session.user = { ...newUserData };
            return newUserData.email
        } catch (error) {
        console.log("🚀 ~ file: users.repository.js:42 ~ sessionServiceDao ~ registerUser= ~ error:", error)
        }
    }

    loginUser = async (req, res) => {
        console.log("loginUser from REPOSITORY executed");
    
        try {
            const usernameEmail = req.params.usernameEmail ?? req.body.username ?? req.body.email;
            const password = req.params.password ?? req.body.password;
    
            const findUserUsernameEmail = await userModel.findOne({ $or: [{ username: usernameEmail }, { email: usernameEmail }] });
    
            if (!findUserUsernameEmail) {
                return res.status(401).json({ message: "username or email not found"});
            }
    
            const isValidComparePsw = await isValidPasswd(password, findUserUsernameEmail.password);
    
            if (!isValidComparePsw) {
                return res.status(401).json({message: `Wrong credentials`});
            }
    
            req.session.user = {...findUserUsernameEmail, password: "",};
            req.session.userName = findUserUsernameEmail.firstName;
            req.session.userRol = findUserUsernameEmail.role;
    
            const signUser = {
                email: findUserUsernameEmail.email,
                role: findUserUsernameEmail.role,
                id: findUserUsernameEmail._id,
            };
    
            const token = await generateJWT({ ...signUser });

            const user = {
                email: findUserUsernameEmail.email,
                role: findUserUsernameEmail.role,
                token: token,
            };

            return user
        } catch (error) {
            console.log("🚀 ~ file: users.repository.js:80 ~ sessionServiceDao ~ loginUser= ~ error:", error);
            res.status(500).json({ message: error.message });
        }
    }
    

    githubLogin = async (req, res) => {
                console.log("githubLogin from REPOSITORY executed");

        try {
            passport.authenticate("github", { scope: ["user:email"] })(req, res);
        } catch (error) {
        console.log("🚀 ~ file: users.repository.js:90 ~ sessionServiceDao ~ githubLogin= ~ error:", error)
        }
    }

    githubCallback = async (req, res) => {
        console.log("githubCallback from REPOSITORY executed");

        try {
            passport.authenticate("github", { failureRedirect: "/login" })(
                req,
                res,
                () => {
                    console.log(
                        `Using ENDPOINT of github/callback to communicate`
                    );
                    req.session.user = req.user;
                    res.redirect("/profile");
                }
            );
        } catch (error) {
        console.log("🚀 ~ file: users.repository.js:110 ~ sessionServiceDao ~ githubCallback= ~ error:", error)
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

module.exports = SessionServiceDao;