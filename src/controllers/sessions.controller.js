const SessionService = require("../services/sessions.service")
const userDao = require('../daos/users.dao');
const CartDao = require("../daos/carts.dao");
const UserService = require ("../services/users.service");
const { API_VERSION } = require("../config/config");
const axios = require('axios');
const handlePolicies = require("../middleware/handle-policies.middleware");


class SessionController {
    constructor() {
        this.sessionService = new SessionService();
        this.userService = new UserService();
        this.userDao = new userDao();
        this.cartDao = new CartDao();
        this.path = "/session";
    }

    getManageUsersPage = async (req, res) => {
        console.log("getManageUsersPage from CONTROLLER executed");
    
        try {
            const userToken = req.session.token
            console.log(userToken)

            if (!userToken) {
                return res.status(401).json({ message: "User token not found" });
            }
    
            req.headers.authorization = `Bearer ${userToken}`;
    
            handlePolicies(["ADMIN"])(req, res, () => {
                res.redirect("/api/v1/view/usersManager");
                console.log({ message: `Page successfully rendered` });
            });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
    

    getRegisterPage = async (req, res) => {
        console.log("getRegisterPage from CONTROLLER executed");

        res.render("register");
    }

    registerUser = async (req, res) => {
        console.log("registerUser from CONTROLLER executed");

        try {
            const userRegistered = await this.sessionService.registerUser(req);
            console.log(`User successfully registered: `, userRegistered);

            return res.status(200).render("loginPage")
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    getLoginPage = async (req, res) => {
        console.log("getLoginPage from CONTROLLER executed");

        res.render("loginPage");
    }

    loginUser = async (req, res) => {
        console.log("loginUser from CONTROLLER executed");
        
        try {
        const userLogged = await this.sessionService.loginUser(req, res);
        
        if (userLogged === null) {
            console.log(`Login Unsuccessful - Username or email not found`);
            return res.status(404).json({ message: "Username or email not found" });
        }
        if (userLogged === undefined) {
            console.log(`Login Unsuccessful - Wrong credentials`);
            return res.status(404).json({ message: "Wrong credentials" });
        }

        console.log(`User successfully logged: `, userLogged);
        return res.redirect("/api/v1/view/products");
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    githubLogin = async (req, res) => {
        console.log("githubLogin from CONTROLLER executed");

        try {
        console.log(`GITHUB LOGIN`);
        } catch (error) {
        res.status(500).json({ message: error.message });
        }
    }

    githubCallback = async (req, res) => {
        try {
            console.log(`GITHUB CALLBACK LOGIN`);
            const uid = req.session.passport.user;
            const githubUser = await this.userDao.getUserById(uid);
            const cid = githubUser.cart._id.toString();;
            const user = {_doc: {cart: cid}};
            req.session.user = user;
            req.session.userCart = cid;

            res.redirect("/api/v1/view/products");
        } catch (error) {
            console.error("Error en githubCallback:", error);
            res.status(500).json({ message: "Error al autenticar con GitHub" });
        }
    };


    logoutUser = async (req, res) => {
        console.log("logoutUser from CONTROLLER executed");

        try {
            const userLoggedOut = await this.sessionService.logoutUser(req, res);
            return res.render("loginPage");
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = SessionController;
