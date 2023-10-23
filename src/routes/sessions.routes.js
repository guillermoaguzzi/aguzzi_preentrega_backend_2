const { Router } = require("express");
const passport = require("passport");
const SessionController = require("../controllers/sessions.controller");

class SessionRoutes {
    constructor() {
        this.router = Router();
        this.sessionController = new SessionController();
        this.path = "/session";

        this.initSessionRoutes();
    }

    initSessionRoutes() {
        this.router.get(`${this.path}/login`, this.sessionController.getLoginPage);
        this.router.get(`${this.path}/manageUsers`, this.sessionController.getManageUsersPage);
        this.router.get(`${this.path}/register`, this.sessionController.getRegisterPage);
        this.router.post(`${this.path}/register`, this.sessionController.registerUser);
        this.router.post(`${this.path}/login`, this.sessionController.loginUser);
        this.router.get(`${this.path}/github`, passport.authenticate("github", { scope: ["user:email"] }));
        this.router.get(`${this.path}/github/callback`, passport.authenticate("github", { failureRedirect: "/api/v1/session/login"}), this.sessionController.githubCallback);
        this.router.get(`${this.path}/logout`, this.sessionController.logoutUser);
    }
}

module.exports = SessionRoutes;
