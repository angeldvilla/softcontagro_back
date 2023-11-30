const { Router } = require("express");
const productRoutes = Router();
const {
  getProducts,
  createProduct,
  editProduct,
  deleteProduct,
} = require("../handlers/productHandler");

productRoutes.get("/", getProducts);

productRoutes.post("/newProduct", createProduct);

productRoutes.put("/edit", editProduct);

productRoutes.delete("/delete", deleteProduct);

module.exports = productRoutes;
