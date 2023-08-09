const { Router } = require("express");
const userModel = require("../dao/models/users.model.js");
const { createHashValue, isValidPasswd } = require("../utils/bcrypt.js");
const passport = require("passport");
const { API_VERSION } = require("../config/config");

const router = Router();

class SessionRoutes {
  path = "/session";
  router = Router();

  constructor() {
    this.initViewsRoutes();
  }

  initViewsRoutes() {



    //LISTADO DE USUARIOS REGISTRADOS
    this.router.get(`${this.path}/users`, async (req, res) => {
      try {
        const usersArr = await userModel.find({});
        return res.json({
          message: `GET: all users succesfully fetched`,
          usersArr,
          });
      } catch (error) {
        console.log(
          "🚀 ~ file: users.routes.js:25 ~ usersRoutes ~ this.router.get ~ error:",
          error
        );
      }
      });




      //REGISTRAR USUARIO
    this.router.get(`${this.path}/register`, (req, res) => {
      res.render("register");
    });

    this.router.post(`${this.path}/register`, async (req, res) => {
      try {
        const firstName = req.params.firstName ?? req.body.firstName;
        const lastName = req.params.lastName ?? req.body.lastName;
        const age = req.params.age ?? req.body.age;
        const username = req.params.username ?? req.body.username;
        const email = req.params.email ?? req.body.email;
        const password = req.params.password ?? req.body.password;

        const pswHashed = await createHashValue(password);
    console.log(
      "🚀 ~ file: session.routes.js:51 ~ router.post ~ pswHashed:",
      pswHashed
    );

        const newUserData = {
          firstName,
          lastName,
          age,
          username,
          email,
          password: pswHashed
        };

        console.log(
          "🚀 ~ file: session.routes.js:58 ~ router.post ~ newUserData:",
          newUserData
        );

        //verificacion si existe el usuario
        const findUserUsername = await userModel.findOne({ username });
        const findUserEmail = await userModel.findOne({ email });
    
        if (findUserUsername || findUserEmail) {
          return res
            .status(409).json({ message: "username and/or email already exist" });
        }

          const newUser = await userModel.create(newUserData);
          console.log(
            "🚀 ~ file: session.routes.js:84 ~ router.post ~ newUser:",
            newUser
          );

          req.session.user = { ...newUserData };
          console.log("User succesully created!")
          return res.render("login");
        
      } catch (error) {
        console.log(
          "🚀 ~ file: session.routes.js:94 ~ router.post ~ error:",
          error
        );
      }
    });




      //LOG IN USUARIO
      this.router.get(`${this.path}/login`, (req, res) => {
        const context = {
            API_VERSION: API_VERSION // Pasa la variable API_VERSION al contexto
        };
        res.render("login", context);
    });
    

    this.router.post(`${this.path}/login`, async (req, res) => {
      try {
        const usernameEmail = req.params.usernameEmail ?? req.body.usernameEmail;
        const password = req.params.password ?? req.body.password;
        const session = req.session;

        console.log(
          "🚀 ~ file: session.routes.js:115 ~ router.post ~ session:",
          session
        );

        //verificacion si existe el usuario
        const findUserUsernameEmail = await userModel.findOne({ $or: [{ username: usernameEmail }, { email: usernameEmail }] });

        console.log(
          "🚀 ~ file: session.routes.js:123 ~ router.post ~ findUserUsernameEmail:",
          findUserUsernameEmail
        );

        if (!findUserUsernameEmail) {
          if (usernameEmail === "adminCoder@coder.com" || password === "adminCod3r123") {
            
            req.session["user"] = usernameEmail
            req.session.admin = true;
            
            req.session.userName = "adminCoder"
            req.session.userRol = "admin"

            console.log("succesful Login for admin")
            return res.redirect("/api/v1/view/products");
          } else {
          return res
            .status(401)
            .json({ message: "username or email not found" });}
        }

        const isValidComparePsw = await isValidPasswd(password, findUserUsernameEmail.password);
        console.log(
          "🚀 ~ file: session.routes.js:146 ~ router.post ~ isValidComparePsw:",
          isValidComparePsw
        );

        if (!isValidComparePsw) {
          return res.status(401).json({
            message: `Wrong credentials`,
          });
        }

        req.session.user = {
          ...findUserUsernameEmail,
          password: "",
        };

        req.session.userName = findUserUsernameEmail.firstName;
        req.session.userRol = "user"

        console.log("succesful Login")
        return res.redirect("/api/v1/view/products");
      } catch (error) {
        console.log(
          "🚀 ~ file: session.routes.js:47 ~ router.post ~ error:",
          error
        );
      }
    });



      //LOG OUT USUARIO
    this.router.get(`${this.path}/logout`, async (req, res) => {
      req.session.destroy((err) => {
        if (!err) {
          console.log("Succesfully loged out" );
          return res.render("login");
        }
        return res.send({ message: `logout Error`, body: err });
      });
    });

    /* GITHUB */
    this.router.get(
      `${this.path}/github`,
      passport.authenticate("github", { scope: ["user:email"] }),
      async (req, res) => {
        console.log(`****** GITHUB Login Strategy *****`);
      }
    );
    
    this.router.get(
      `${this.path}/github/callback`,
      passport.authenticate("github", { failureRedirect: "/login" }),
      async (req, res) => {
        try {
          console.log(
            `****** Using ENDPOINT of github/callback to comunicate *****`
          );
          req.session.user = req.user;
          res.redirect("/profile");
        } catch (error) {
          console.log("🚀 ~ file: session.routes.js:115 ~ error:", error);
        }
      }
    );

  }
}

module.exports = SessionRoutes;
