const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const City = require("./citysModel");
const Deparment = require("./deparmentModel");
const Country = require("./countrysModel");
const Users = require("./usersModel");

const Address = sequelize.define(
  "direcciones",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    direccion: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ciudad_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    departamento_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    pais_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    codigo_postal: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

Address.belongsTo(Users, { foreignKey: "usuario_id", targetKey: "id" });
Users.hasOne(Address, { foreignKey: "usuario_id", sourceKey: "id" });

Address.hasOne(City, { foreignKey: "ciudad_id", targetKey: "id" });
City.hasMany(Address, { foreignKey: "ciudad_id", sourceKey: "id" });

Address.hasOne(Deparment, { foreignKey: "departamento_id", targetKey: "id" });
Deparment.hasMany(Address, { foreignKey: "departamento_id", sourceKey: "id" });

Address.hasOne(Country, { foreignKey: "pais_id", targetKey: "id" });
Country.hasMany(Address, { foreignKey: "pais_id", sourceKey: "id" });

module.exports = Address;
