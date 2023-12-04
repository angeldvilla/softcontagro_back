const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const Category = require("./categoryModel");
const User = require("../models/usersModel");

const Product = sequelize.define(
  "productos",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre_producto: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    precio: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    estado: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
  },
  {
    timestamps: false,
  }
);


Product.belongsTo(Category, { foreignKey: "categoria_id", targetKey: "id" });
Category.hasMany(Product, { foreignKey: "categoria_id", sourceKey: "id" });

Product.belongsTo(User, { foreignKey: "usuarioId", targetKey: "id" });
User.hasMany(Product, { foreignKey: "usuarioId", sourceKey: "id" });


module.exports = Product;
