const { Router } = require("express");
const MailingCtrl = require("../controllers/mailing.controller");


class MailingRoutes {
    constructor() {
        this.router = Router();
        this.mailingCtrl = new MailingCtrl();
        this.path = "/mailing";

        this.initRoutes();
    }

    initRoutes() {
        this.router.post(`${this.path}/email/send`, this.mailingCtrl.sendEmail);
        this.router.post(`${this.path}/sms/send`, this.mailingCtrl.sendSms);
    }
}

module.exports = MailingRoutes;
