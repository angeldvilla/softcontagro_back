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

Order.belongsTo(Address, { foreignKey: "shippingInfoId", targetKey: "id" });
Address.hasOne(Order, { foreignKey: "shippingInfoId", sourceKey: "id" });

Order.belongsTo(User, { foreignKey: "userId", targetKey: "id" });
User.hasMany(Order, { foreignKey: "userId", sourceKey: "id" });

Order.hasMany(OrderItem, { foreignKey: "orderId" });
OrderItem.belongsTo(Order, { foreignKey: "orderId" });

Order.hasOne(Payment, { foreignKey: "paymentInfoId" });
Payment.belongsTo(Order, { foreignKey: "paymentInfoId" });

module.exports = Order;
