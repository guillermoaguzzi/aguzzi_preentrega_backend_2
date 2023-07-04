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
};
