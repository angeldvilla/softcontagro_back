const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const Departament = require("./deparmentModel");

const City = sequelize.define(
  "ciudades",
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

City.belongsTo(Departament, { foreignKey: "departamento_id", targetKey: "id" });
Departament.hasMany(City, { foreignKey: "departamento_id", sourceKey: "id" });

module.exports = City;
