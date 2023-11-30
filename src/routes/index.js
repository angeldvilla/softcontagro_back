const { Router } = require("express");
const router = Router();
const authRoutes = require("./authRoutes");
const profileRoutes = require("./profileRoutes");
const categoryRoutes = require("./categoryRoutes");
const productRoutes = require("./productRoutes");
const orderRoutes = require("./orderRoutes");
const orderDetailRoutes = require("./orderDetailRoutes");
const cartRoutes = require("./cartRoutes");

//rutas de la api
router.use("/auth", authRoutes);
router.use("/profile", profileRoutes);
router.use("/category", categoryRoutes);
router.use("/product", productRoutes);
router.use("/orders", orderRoutes);
router.use("/order-details", orderDetailRoutes);
router.use("/cart", cartRoutes);

module.exports = router;
