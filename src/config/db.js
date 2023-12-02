const { Sequelize } = require("sequelize");

const { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD } = process.env;

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  dialect: "mysql",
  port: DB_PORT,
});

module.exports = {
  sequelize,
};