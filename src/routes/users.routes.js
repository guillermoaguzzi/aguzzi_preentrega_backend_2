const { Router } = require("express");
const UserCtrl = require("../controllers/users.controller");
const handlePolicies = require("../middleware/handle-policies.middleware");

class UsersRoutes {
    constructor() {
        this.router = Router();
        this.userCtrl = new UserCtrl();
        this.path = "/users";

        this.initRoutes();
    }

    initRoutes() {
        this.router.get(`${this.path}/current`, this.userCtrl.currentUser);
        this.router.get(`${this.path}`, handlePolicies(["ADMIN"]), this.userCtrl.getAllUsers);
        this.router.get(`${this.path}/:uid`, handlePolicies(["ADMIN"]), this.userCtrl.getUserById);
        this.router.post(`${this.path}`, handlePolicies(["ADMIN"]), this.userCtrl.createUser);
        this.router.put(`${this.path}/:pid`, handlePolicies(["ADMIN"]), this.userCtrl.updateUserById);
        this.router.delete(`${this.path}/:uid`, handlePolicies(["ADMIN"]), this.userCtrl.deleteUserById);
        
    }
}

module.exports = UsersRoutes;
