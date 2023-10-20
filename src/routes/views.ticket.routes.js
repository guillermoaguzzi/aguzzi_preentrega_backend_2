const { Router } = require("express");
const { API_VERSION } = require("../config/config");
const { authMdw } = require("../middleware/auth.middleware");
const CartService = require ("../repository/carts.repository");
const cartsModel = require("../models/carts.models");


class TicketViewsRoutes {
  path = "/view/ticket";
  router = Router();

  constructor() {
  this.initViewsRoutes();
  this.cartService = new CartService();
  }

  initViewsRoutes() {
    this.router.post(`${this.path}`, authMdw, async (req, res) => {

      const {cart, email} = req.session.user._doc;

      const ticket = await this.cartService.purchaseCart(cart, email);

      const ticketDateTime= ticket.dateTime
      const ticketPurchasedBy = ticket.purchasedBy;
      const productsFromTicket = ticket.details
      const ticketDetails = productsFromTicket.map(item => {
        return {
          ...item.product._doc,
          quantity: item.quantity
        };
      });
      const ticketAmount = ticket.amount;

          const userName = req.session.userName ? req.session.userName.charAt(0).toUpperCase() + req.session.userName.slice(1) : "";
          const userRol = req.session.userRol;
          const userToken = req.session.token;
          const isUserAdmin = userRol === "ADMIN";
          const isUserNotAdmin = userRol !== "ADMIN";

          const renderElements =  {
            ticketDateTime,
            ticketPurchasedBy,
            ticketDetails,
            ticketAmount,
            userName,
            userRol,
            userToken,
            isUserAdmin,
            isUserNotAdmin,
            API_VERSION,
          };

            res.render("ticket", renderElements);


      const result = {
        status: "success",
      };

    });
    }
    }

module.exports = TicketViewsRoutes;
