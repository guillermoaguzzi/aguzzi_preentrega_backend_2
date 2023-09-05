const { Router } = require("express");
const passport = require("passport");
const { passportCall } = require("../utils/jwt");
const { authorization } = require("../middleware/auth.middleware");
const { roleType } = require("../models/users.model");
const userModel = require("../models/users.model");
const handlePolicies = require("../middleware/handle-policies.middleware");

const router = Router();

class UsersRoutes {
  path = "/users"
  router = Router();

  constructor() {
    this.initUsersRoutes();
  }


initUsersRoutes() {

  this.router.get(
    "/current",
    [passportCall("jwt"), authorization(["USER", "ADMIN"])],
    (req, res) => {
      return res.send(req.user);
    }
  );
  
  
  
  this.router.get("/", handlePolicies([]), async (req, res) => {
    const users = await userModel.find({});
    return res.json({ message: "list of users", users });
  });
  
  
  this.router.get(
    "/:uid",
    handlePolicies(["ADMIN"]),
    async (req, res) => {
      const { uid } = req.params;
      const user = await userModel.findById(uid);
  
      if (!user) {
        return res.status(404).json({
          message: `user ${uid} info not found`,
        });
      }
  
      return res.json({ message: "user info", user });
    }
  );
  
  
  this.router.delete("/:uid", handlePolicies(["ADMIN"]), async (req, res) => {
    const { uid } = req.params;
    const user = await userModel.findById(uid);
  
    if (!user) {
      return res.status(404).json({
        message: `user ${uid} info not found`,
      });
    }
  
    const userDel = await userModel.deleteOne({ id: uid });
    console.log(
      "🚀 ~ file: user.routes.js:50 ~ router.delete ~ userDel:",
      userDel
    );
  
    return res.json({ message: "user deleted" });
  });
  
}
}


module.exports = UsersRoutes;
