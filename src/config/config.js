const { config } = require("dotenv");

config({ path: `.env.${process.env.NODE_ENV || "development"}.local` });

const {
    API_VERSION,
    NODE_ENV,
    ORIGIN,
    DB_PORT,
    DB_CNN,
    DB_HOST,
    DB_NAME,
    DB_USER,
    DB_PASSWORD,
    PERSISTENCE,
    GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET,
    ROLES,
    SECRET_JWT,
    EMAIL,
    EMAIL_PSW,
    SMS_ACC_SID,
    SMS_AUTH_TOKEN,
    SMS_PHONE,
} = process.env;

module.exports = {
    API_VERSION,
    NODE_ENV,
    ORIGIN,
    DB_PORT,
    DB_CNN,
    DB_HOST,
    DB_NAME,
    DB_USER,
    DB_PASSWORD,
    PERSISTENCE,
    GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET,
    ROLES,
    SECRET_JWT,
    EMAIL,
    EMAIL_PSW,
    SMS_ACC_SID,
    SMS_AUTH_TOKEN,
    SMS_PHONE,
};
