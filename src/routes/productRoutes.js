const { Router } = require("express");
const productRoutes = Router();
const {
  getAllProducts,
  getProductDetails,
  getAdminProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

productRoutes.get("/", getAllProducts);

productRoutes.get("/product/:id", getProductDetails);

productRoutes.get("/admin/products", isAuthenticatedUser, authorizeRoles("Administrador"), getAdminProducts);

productRoutes.post("/admin/product/new", isAuthenticatedUser, authorizeRoles("Administrador"), createProduct);

productRoutes.put("/admin/product/:id", isAuthenticatedUser, authorizeRoles("Administrador"), updateProduct);

productRoutes.delete("/admin/product/:id", isAuthenticatedUser, authorizeRoles("Administrador"), deleteProduct);


module.exports = productRoutes;
