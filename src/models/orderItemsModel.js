const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const Order = require("./orderModel");
const Product = require("./productModel");

const OrderItem = sequelize.define(
  "ordenesItems",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    precio: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    fecha: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    orden_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    producto_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

OrderItem.belongsTo(Order, { foreignKey: "orden_id", targetKey: "id" });
Order.hasMany(OrderItem, { foreignKey: "orden_id", sourceKey: "id" });

OrderItem.belongsTo(Product, { foreignKey: "producto_id", targetKey: "id" });
Product.hasMany(OrderItem, { foreignKey: "producto_id", sourceKey: "id" });

module.exports = OrderItem;
