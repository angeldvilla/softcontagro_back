const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const Product = require("./productModel");

const OrderItem = sequelize.define(
  "ordenItems",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    precio: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    imagen: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

OrderItem.belongsTo(Product, { foreignKey: "productoId", targetKey: "id" });
Product.hasMany(OrderItem, { foreignKey: "productoId", sourceKey: "id" });

module.exports = OrderItem;