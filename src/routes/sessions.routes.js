const { Router } = require("express");
const SessionController = require("../controllers/sessions.controller");

class SessionRoutes {
    constructor() {
        this.router = Router();
        this.sessionController = new SessionController();
        this.path = "/session";

        this.initSessionRoutes();
    }

    initSessionRoutes() {
        this.router.get(`${this.path}/register`, this.sessionController.getRegisterPage);
        this.router.post(`${this.path}/register`, this.sessionController.registerUser);
        this.router.get(`${this.path}/login`, this.sessionController.getLoginPage);
        this.router.post(`${this.path}/login`, this.sessionController.loginUser);
        this.router.get(`${this.path}/github`, this.sessionController.githubLogin);
        this.router.get(`${this.path}/github/callback`, this.sessionController.githubCallback);
        this.router.get(`${this.path}/logout`, this.sessionController.logoutUser);
    }
}

module.exports = SessionRoutes;
