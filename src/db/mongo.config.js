const { connect } = require("mongoose");

const { DB_PORT, DB_NAME, DB_CNN, DB_HOST } = require("../config/config");

const configConnection = {
  url: DB_CNN ?? `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`,
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
};

const mongoDBConnection = async () => {
  try {
    await connect(configConnection.url, configConnection.options);
    console.log(`========CONNECTION MONGO========= `);
    console.log(
      `=== URL: ${configConnection.url.substring(0, 20)} ===`
    );
    console.log(`=================================`);
  } catch (err) {
    console.log("🚀 ~ file: mongo.config.js:9 ~ mongoDBConnection ~ err:", err);
  }
};

module.exports = {
  mongoDBConnection,
};