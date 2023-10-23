const MailingService = require ("../services/mailing.service");



class MailingCtrl {
    constructor() {
        this.mailingService = new MailingService;
    }

    sendEmail = async (req, res) => {
        console.log("sendEmails from CONTROLLER executed");

        try {
        const emailAdress = req.body.email 

        const emails = await this.mailingService.sendEmail(emailAdress, res);
        console.log(`Email succesfully sent to ${emails}`);
        return res.send({ ok: true, message: `Email sent to ${emailAdress}` });
        } catch (error) {
        return res.status(500).json({ message: error.message });
        }};

        sendSms = async (req, res) => {
            console.log("sendSms from CONTROLLER executed");
    
            try {
            const smsData = req.body 
    
            const sms = await this.mailingService.sendSms(res, smsData);
            return { ok: true, message: `Sms sent to ${smsData.name} at ${smsData.phone}` };
            } catch (error) {
            return res.status(500).json({ message: error.message });
            }};
};

module.exports =  MailingCtrl;
