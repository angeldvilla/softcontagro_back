const { Router } = require("express");
const orderRoutes = Router();
const {
  newOrder,
  getSingleOrder,
  myOrders,
  getAllOrders,
  updateOrder,
  deleteOrder,
} = require("../controllers/orderController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

orderRoutes.post("/order/new", isAuthenticatedUser, newOrder);

orderRoutes.get("/order/:id", isAuthenticatedUser, getSingleOrder);

orderRoutes.get("/orders/me", isAuthenticatedUser, myOrders);

orderRoutes.get("/admin/orders", isAuthenticatedUser, authorizeRoles("Administrador"), getAllOrders);

orderRoutes.put("/admin/order/:id", isAuthenticatedUser, authorizeRoles("Administrador"), updateOrder);

orderRoutes.delete("/admin/order/:id", isAuthenticatedUser, authorizeRoles("Administrador"), deleteOrder);


module.exports = orderRoutes;
