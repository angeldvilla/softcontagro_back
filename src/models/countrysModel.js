const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Country = sequelize.define(
  "paises",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = Country;