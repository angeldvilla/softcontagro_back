const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const Product = require("./productModel");

const ProductImage = sequelize.define(
  "imagenes",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    publicId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

ProductImage.belongsTo(Product, { foreignKey: "productoId", targetKey: "id" });
Product.hasMany(ProductImage, { foreignKey: "productoId", sourceKey: "id" });

module.exports = ProductImage;
