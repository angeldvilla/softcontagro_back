const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const Country = require("./countrysModel");

const Deparment = sequelize.define(
  "departamentos",
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
    pais_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

Deparment.belongsTo(Country, { foreignKey: "pais_id", targetKey: "id" });
Country.hasMany(Deparment, { foreignKey: "pais_id", sourceKey: "id" });

module.exports = Deparment;
