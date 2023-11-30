const { Router } = require("express");
const orderRoutes = Router();
const {
  getOrders,
  createOrder,
  editOrder,
  deleteOrder,
} = require("../handlers/orderHandler");

orderRoutes.get("/:userId", getOrders);

orderRoutes.post("/add/:userId", createOrder);

orderRoutes.put("/confirm/:userId/", editOrder);

orderRoutes.delete("/delete/:orderId", deleteOrder);

module.exports = orderRoutes;
