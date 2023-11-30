const { Router } = require("express");
const router = Router();
const authRoutes = require("./authRoutes");
const profileRoutes = require("./profileRoutes");
const categoryRoutes = require("./categoryRoutes");
const productRoutes = require("./productRoutes");
const salesRoutes = require("./salesRoutes");

//rutas de la api
router.use("/auth", authRoutes);
router.use("/profile", profileRoutes);
router.use("/category", categoryRoutes);
router.use("/product", productRoutes);
router.use("/sales", salesRoutes);

module.exports = router;
