const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const Address = require("./addressModel");
const OrderItem = require("../models/orderItemsModel");
const Payment = require("../models/paymentModel");
const User = require("./usersModel");

const Order = sequelize.define(
  "ordenes",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    pagado_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    precio_articulos: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    precio_impuesto: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    precio_envio: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    precio_total: {
      type: DataTypes.INTEGER,
      allowNull: false,
      default: 0,
    },
    estado_orden: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Processing",
    },
    entregado_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    creado_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: false,
  }
);

Order.belongsTo(Address, { foreignKey: "direccionInfoId", targetKey: "id" });
Address.hasOne(Order, { foreignKey: "direccionInfoId", sourceKey: "id" });

Order.belongsTo(User, { foreignKey: "usuarioId", targetKey: "id" });
User.hasMany(Order, { foreignKey: "usuarioId", sourceKey: "id" });

Order.hasMany(OrderItem, { foreignKey: "ordenId" });
OrderItem.belongsTo(Order, { foreignKey: "ordenId" });

Order.hasOne(Payment, { foreignKey: "pagoInfoId" });
Payment.belongsTo(Order, { foreignKey: "pagoInfoId" });

module.exports = Order;
