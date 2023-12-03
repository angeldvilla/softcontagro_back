const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const Product = require("./productModel");

const Image = sequelize.define(
  "imagenes",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    producto_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  },
  {
    timestamps: false,
  }
);

Image.belongsTo(Product, { foreignKey: "imagen_id", targetKey: "id" });
Product.hasMany(Image, { foreignKey: "imagen_id", sourceKey: "id" });

module.exports = Image;
