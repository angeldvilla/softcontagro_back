// routes/cartRoutes.js
const { Router } = require("express");
const cartRoutes = Router();
const {
  getCart,
  addToCart,
  removeFromCart,
  updateCart,
} = require("../handlers/cartHandler");

cartRoutes.get("/:id", getCart);
cartRoutes.post("/add/:id:productId", addToCart);
cartRoutes.delete("/remove/:id/:productId", removeFromCart);
cartRoutes.put("/update/:id", updateCart);

module.exports = cartRoutes;
