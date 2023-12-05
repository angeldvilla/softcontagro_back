const { sequelize } = require("./db");
const Address = require("../models/addressModel");
const Category = require("../models/categoryModel.js");
const Favorites = require("../models/favoritesModel.js");
const Image = require("../models/imageModel.js");
const Order = require("../models/orderModel.js");
const OrderItem = require("../models/orderItemsModel.js");
const Payment = require("../models/paymentModel.js");
const Product = require("../models/productModel.js");
const Role = require("../models/roleModel.js");
const Users = require("../models/usersModel.js");

async function syncDatabase() {
  try {
    await sequelize.sync({ force: true });
    console.log("Base de datos sincronizada correctamente.");
  } catch (error) {
    console.error("Error al sincronizar la base de datos:", error);
  } finally {
    // Cierra la conexión después de sincronizar
    sequelize.close();
  }
}

// Sincroniza la base de datos al ejecutar el script
syncDatabase();
