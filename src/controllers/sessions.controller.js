
const {UserService} = require("../repository/repository.index")
const { API_VERSION } = require("../config/config");


class SessionController {
    constructor() {
        this.userService = UserService;
    }

    getRegisterPage = async (req, res) => {
        console.log("getRegisterPage from CONTROLLER executed");

        res.render("register");
    }

    registerUser = async (req, res) => {
        console.log("registerUser from CONTROLLER executed");

        try {
            const userRegistered = await this.userService.registerUser(req, res);
            console.log(`User successfully registered: `, userRegistered);
            return res.render("login");
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    getLoginPage = async (req, res) => {
        console.log("getLoginPage from CONTROLLER executed");

        const context = {
            API_VERSION: API_VERSION,
        };
        res.render("login", context);
    }

    loginUser = async (req, res) => {
        console.log("loginUser from CONTROLLER executed");

        try {
        const userLogged = await this.userService.loginUser(req, res);
        console.log(`User successfully logged: `, userLogged);
        return res.redirect("/api/v1/view/products");
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    githubLogin = async (req, res) => {
        console.log("githubLogin from CONTROLLER executed");

        try {
        const githubLogin = await this.userService.githubLogin();
        return res.json({ message: `User successfully logged through Github`, githubLogin});
        } catch (error) {
        res.status(500).json({ message: error.message });
        }
    }

    githubCallback = async (req, res) => {
        console.log("githubCallback from CONTROLLER executed");

        try {
        const githubCallback = await this.userService.githubCallback(req, res);
        return res.json({ message: `User successfully logged through Github`, githubCallback});
        } catch (error) {
        res.status(500).json({ message: error.message });
        }
    }

    logoutUser = async (req, res) => {
        console.log("logoutUser from CONTROLLER executed");

        try {
            const userLoggedOut = await this.userService.logoutUser(req, res);
            return res.render("login");
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = SessionController;
