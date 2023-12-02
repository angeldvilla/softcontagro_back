const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const Image = require("./imageModel");
const Category = require("./categoryModel");
const Users = require("./usersModel");

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
    imagen_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    estado: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    categoria_id: {
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

Product.belongsTo(Users, { foreignKey: "usuario_id", targetKey: "id" });
Users.hasMany(Product, { foreignKey: "usuario_id", sourceKey: "id" });

Product.belongsTo(Category, { foreignKey: "categoria_id", targetKey: "id" });
Category.hasMany(Product, { foreignKey: "categoria_id", sourceKey: "id" });

Product.belongsTo(Image, { foreignKey: "imagen_id", targetKey: "id" });
Image.hasOne(Product, { foreignKey: "imagen_id", sourceKey: "id" });

module.exports = Product;
