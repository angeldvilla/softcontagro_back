const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const Order = require("./orderModel");
const Users = require("./usersModel");

const Payment = sequelize.define(
  "pagos",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    estado: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    orden_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

Payment.belongsTo(Order, { foreignKey: "orden_id", targetKey: "id" });
Order.hasOne(Payment, { foreignKey: "orden_id", sourceKey: "id" });

Payment.belongsTo(Users, { foreignKey: "usuario_id", targetKey: "id" });
Users.hasMany(Payment, { foreignKey: "usuario_id", sourceKey: "id" });

module.exports = { Payment };
