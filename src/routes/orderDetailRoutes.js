const { Router } = require("express");
const orderDetailRoutes = Router();
const { getOrderDetails } = require("../handlers/detailOrderHandler");

orderDetailRoutes.get("/:orderId", getOrderDetails);

module.exports = orderDetailRoutes;
