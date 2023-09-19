const nodemailer = require("nodemailer");
const twilio = require("twilio");
const { EMAIL, EMAIL_PSW, SMS_ACC_SID, SMS_AUTH_TOKEN, SMS_PHONE} = require("../config/config");
const path = require('path');

const transporter = nodemailer.createTransport({
    service: "gmail",
    user: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: EMAIL,
        pass: EMAIL_PSW,
    },
    tls: {
        rejectUnauthorized: false,
    },
});

const client = twilio(SMS_ACC_SID, SMS_AUTH_TOKEN);

class MailingService {
    constructor() {
    }

    sendEmail = async (res, emailAdress) => {
        console.log("sendEmails from REPOSITORY executed");

        try {
            let result = await transporter.sendMail({
                FROM: EMAIL,
                to: emailAdress,
                subject: `Kickstart your singing career!`,
                html: `
                <div>
                    <img src="cid:logo" />
                    <h1>GPAD RECORDS</h1>
                    <h3>Music Production</h3>
                    <p>we're happy to tell you that we have some interest in you! <br> Please see document attached to find out more!</p>
                </div>
                `,
                attachments: [
                    {
                        filename: "logo-192x192.png",
                        path: path.join(process.cwd(), 'src', 'public', 'imgs', 'logo-192x192.png'),
                        cid: "logo",
                    },
                    {
                        filename: "Presentation.pdf",
                        path: path.join(process.cwd(), 'src', 'public', 'docs', 'Presentation.pdf'),
                    },
                ]
            });
            console.log(
                "🚀 ~ file: emails.routes.js:49 ~ EmailService ~ sendEmails ~ result:",
                result
            );
        
            return res.send({ ok: true, message: `Email sent to ${emailAdress}` });
        } catch (error) {
        console.log("🚀 ~ file: emails.repository.js:55 ~ EmailService ~ sendEmails= ~ error:", error)
        }
    };

    sendSms = async (res, smsData) => {
        console.log("sendSms from REPOSITORY executed");

        try {
            let result = await client.messages.create({
                body: `Hey, ${smsData.name}! check your email, we've got something for you!`,
                from: SMS_PHONE,
                to: smsData.phone,
                });
                console.log("🚀 ~ file: sms.routes.js:72 ~ router.post ~ result:", result);
                
                return res.send({ ok: true, message: `Sms sent to ${smsData.name} at ${smsData.phone}` });
        } catch (error) {
        console.log("🚀 ~ file: emails.repository.js:76 ~ EmailService ~ sendEmails= ~ error:", error)
        }
    };
}

module.exports = MailingService;