const { Router } = require("express");
const router = Router();
const authRoutes = require("./authRoutes");
const profileRoutes = require("./profileRoutes");

//rutas de la api
router.use("/auth", authRoutes);
router.use("/profile", profileRoutes);

module.exports = router;
