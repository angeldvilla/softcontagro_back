const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const Users = require("./usersModel");
const Product = require("./productModel");

const Favorites = sequelize.define(
  "favoritos",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
  },
  {
    timestamps: false,
  }
);

Users.belongsToMany(Product, { through: Favorites });
Product.belongsToMany(Users, { through: Favorites });

module.exports = Favorites;
