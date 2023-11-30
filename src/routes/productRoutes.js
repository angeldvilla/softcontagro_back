const { Router } = require("express");
const productRoutes = Router();
const {
  getProducts,
  createProduct,
  editProduct,
  deleteProduct,
} = require("../handlers/productHandler");

productRoutes.get("/", getProducts);

productRoutes.post("/add", createProduct);

productRoutes.put("/:id", editProduct);

productRoutes.delete("/:id", deleteProduct);

module.exports = productRoutes;
