const { Router } = require("express");
const router = Router();
const products = require("./product");
const auth = require("./auth");
const payment = require("./payment");
const order = require("./order");
const category = require("./category");

router.use("/api/v1", products);
router.use("/api/v1", auth);
router.use("/api/v1", payment);
router.use("/api/v1", order);
router.use("/api/v1", category);

module.exports = router;