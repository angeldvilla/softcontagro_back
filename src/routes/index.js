const { Router } = require("express");
const router = Router();
const authRoutes = require("./authRoutes");

//rutas de la api
router.use("/auth", authRoutes);

module.exports = router;
