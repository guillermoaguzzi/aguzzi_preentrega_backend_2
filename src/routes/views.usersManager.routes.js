const { Router } = require("express");
const { generateJWT } = require("../utils/jwt");
const { passportCall } = require("../utils/jwt");
const { authorization } = require("../middleware/auth.middleware");
const { API_VERSION } = require("../config/config");
const cartsModel = require("../models/carts.models");
const CartService = require ("../repository/carts.repository");
const userModel = require("../models/users.model");
const UserService = require ("../repository/users.repository");


class UsersManagerViewsRoutes {
  path = "/view/usersManager";
  router = Router();

  constructor() {
    this.initViewsRoutes();
    this.userService = new UserService();
    this.cartService = new CartService();
  }

  initViewsRoutes() {
    this.router.get(`${this.path}`, async (req, res) => {

      req.headers.authorization = `Bearer ${req.session.token}`;

      passportCall("jwt")(req, res, async () => {
        authorization(["ADMIN"])(req, res, async () => {


          const limit = req.query.limit || 5;
          const role = req.query.role || null;
          const page = req.query.page || 1;
          const roles = [];
          const noRole = null;
          const uid = req.query.uid || null;
          const newRole = req.query.newRole;

          const userToUpdate = req.query.userToUpdate;
          const userToDelete = req.query.userToDelete;

          //ROLE RELATED INFO
          const pipeline = [
            {
              $group: { _id: "$role" },
            }
          ]

          const UsersRoles = await userModel.aggregate(pipeline);

          
          for (let i = 0; i < UsersRoles.length; i++) {
            const rolesValues = UsersRoles[i]._id;
            roles.push(rolesValues);
          }
          
          let query = {};
          let users = [];
          let user = {};
          let userDeleted = false;
          let userUpdated = false;
          let roleUpdateData = {
            role: "",
          };
          
          if (role) {
            query.role = role;
          } else if (uid) {
            query._id = uid;
          }
          
          if (userToDelete) {
            await userModel.deleteOne({ _id: userToDelete });
            userDeleted = true
          }
          if (userToUpdate) {
            roleUpdateData = {
              role: newRole,
            };
            if(newRole === "ADMIN"){
              const user = await userModel.findById(userToUpdate);
              const userCartId = user.cart.toString();
              user.set('cart', undefined);
              await user.save();

              const cartToDelete = await cartsModel.findById(userCartId);
              const deleteCart = await cartsModel.deleteOne({ _id: userCartId });


            };
              await userModel.updateOne({ _id: userToUpdate }, { $set: roleUpdateData });

            userUpdated = true
          }

          const roleURL = query.role;
          const uidURL = query.uid;

          const {
            docs,
            hasPrevPage,
            hasNextPage,
            nextPage,
            prevPage,
            totalPages,
          } = await userModel.paginate(query, { limit, page, lean: true });

          if (role) {
            users = docs;
          } else if (uid) {
            user = docs;
          }

          //PAGE RELATED INFO
          // 2 previous pages
          const previousPagesNumbers = [];

          if (page >= 3) {
            for (let i = 0; i < 2; i++) {
              const previousPages = +page - i - 1;
              previousPagesNumbers.push(previousPages);
            }
          }

          // 2 following pages
          const followingPagesNumbers = [];

          if (totalPages - page >= 2) {
            for (let i = 0; i < 2; i++) {
              const followingPages = +page + i + 1;
              followingPagesNumbers.push(followingPages);
            }
          }

          previousPagesNumbers.sort((a, b) => a - b);

          // First and last page
          const firstPage = 1;
          const lastPage = totalPages;

          const firstPageExist = page >= 4 ? firstPage : null;
          const lastPageExist = followingPagesNumbers.length > 1 && totalPages - page >= 3 ? lastPage: null;


          //SESSION USER RELATED INFO
          const userName = req.session.userName ? req.session.userName.charAt(0).toUpperCase() + req.session.userName.slice(1) : "";
          const userRol = req.session.userRol;
          const userToken = req.session.token;
          const isUserAdmin = userRol === "ADMIN";

              const renderElements =  {
                  users,
                  user,
                  userToDelete,
                  userDeleted,
                  userToUpdate,
                  userUpdated,
                  newRole,
                  roles,
                  noRole,
                  roleURL,
                  uidURL,
                  limit,
                  page,
                  hasPrevPage,
                  hasNextPage,
                  prevPage,
                  nextPage,
                  totalPages,
                  previousPagesNumbers,
                  followingPagesNumbers,
                  firstPage,
                  lastPage,
                  firstPageExist,
                  lastPageExist,
                  userName,
                  userRol,
                  userToken,
                  API_VERSION,
              };

            res.render("usersManager", renderElements)

              const result = {
                status: "success",
                payload: docs,
                totalPages: totalPages,
                prevPage: prevPage,
                nextPage: nextPage,
                page: page,
                hasPrevPage: hasPrevPage,
                hasNextPage: hasNextPage,
                prevLink: hasPrevPage
                  ? `/api/v1/view/products?limit=${limit}&page=${prevPage}&role=${role}`
                  : null,
                nextLink: hasNextPage
                  ? `/api/v1/view/products?limit=${limit}&page=${nextPage}&role=${role}`
                  : null,
              };// de result
        });// de autorization
      });//
    });










    this.router.post(`${this.path}`, async (req, res) => {

      req.headers.authorization = `Bearer ${req.session.token}`;

      passportCall("jwt")(req, res, async () => {
        authorization(["ADMIN"])(req, res, async () => {


          const limit = req.body.limit || 5;
          const role = req.body.role || null;
          const page = req.body.page || 1;
          const roles = [];
          const noRole = null;
          const uid = req.body.uid || null;
          const newRole = req.body.newRole;

          const userToUpdate = req.body.userToUpdate;
          const userToUpdatePreviousRole = req.body.userToUpdatePreviousRole;
          const userToDelete = req.body.userToDelete;

          //ROLE RELATED INFO
          const pipeline = [
            {
              $group: { _id: "$role" },
            }
          ]

          const UsersRoles = await userModel.aggregate(pipeline);

          
          for (let i = 0; i < UsersRoles.length; i++) {
            const rolesValues = UsersRoles[i]._id;
            roles.push(rolesValues);
          }
          
          let query = {};
          let users = [];
          let user = {};
          let userDeleted = false;
          let userUpdated = false;
          let roleUpdateData = {
            role: "",
          };
          
          if (role) {
            query.role = role;
          } else if (uid) {
            query._id = uid;
          }
          
          if (userToDelete) {
            await this.userService.deleteUserById(userToDelete)
            userDeleted = true
          }

          if (userToUpdate) {

            roleUpdateData = {
              role: newRole,
            };

            await this.userService.updateUserById(userToUpdate, roleUpdateData, userToUpdatePreviousRole, )
            userUpdated = true
          }

          const roleURL = query.role;
          const uidURL = query.uid;

          const {
            docs,
            hasPrevPage,
            hasNextPage,
            nextPage,
            prevPage,
            totalPages,
          } = await userModel.paginate(query, { limit, page, lean: true });

          if (role) {
            users = docs;
          } else if (uid) {
            user = docs;
          }

          //PAGE RELATED INFO
          // 2 previous pages
          const previousPagesNumbers = [];

          if (page >= 3) {
            for (let i = 0; i < 2; i++) {
              const previousPages = +page - i - 1;
              previousPagesNumbers.push(previousPages);
            }
          }

          // 2 following pages
          const followingPagesNumbers = [];

          if (totalPages - page >= 2) {
            for (let i = 0; i < 2; i++) {
              const followingPages = +page + i + 1;
              followingPagesNumbers.push(followingPages);
            }
          }

          previousPagesNumbers.sort((a, b) => a - b);

          // First and last page
          const firstPage = 1;
          const lastPage = totalPages;

          const firstPageExist = page >= 4 ? firstPage : null;
          const lastPageExist = followingPagesNumbers.length > 1 && totalPages - page >= 3 ? lastPage: null;


          //SESSION USER RELATED INFO
          const userName = req.session.userName ? req.session.userName.charAt(0).toUpperCase() + req.session.userName.slice(1) : "";
          const userRol = req.session.userRol;
          const userToken = req.session.token;
          const isUserAdmin = userRol === "ADMIN";

              const renderElements =  {
                  users,
                  user,
                  userToDelete,
                  userDeleted,
                  userToUpdate,
                  userUpdated,
                  newRole,
                  roles,
                  noRole,
                  roleURL,
                  uidURL,
                  limit,
                  page,
                  hasPrevPage,
                  hasNextPage,
                  prevPage,
                  nextPage,
                  totalPages,
                  previousPagesNumbers,
                  followingPagesNumbers,
                  firstPage,
                  lastPage,
                  firstPageExist,
                  lastPageExist,
                  userName,
                  userRol,
                  userToken,
                  API_VERSION,
              };

            res.render("usersManager", renderElements)

              const result = {
                status: "success",
                payload: docs,
                totalPages: totalPages,
                prevPage: prevPage,
                nextPage: nextPage,
                page: page,
                hasPrevPage: hasPrevPage,
                hasNextPage: hasNextPage,
                prevLink: hasPrevPage
                  ? `/api/v1/view/products?limit=${limit}&page=${prevPage}&role=${role}`
                  : null,
                nextLink: hasNextPage
                  ? `/api/v1/view/products?limit=${limit}&page=${nextPage}&role=${role}`
                  : null,
                };
              });
            });
          });
};
};

module.exports = UsersManagerViewsRoutes;
