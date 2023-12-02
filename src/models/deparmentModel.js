const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Deparment = sequelize.define(
  "ciudad",
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
    ciudad_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = { Deparment };
