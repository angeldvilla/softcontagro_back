const { Router } = require("express");
const router = Router();

const products = require("./productsRouter");
const clients = require("./clientsRouter");
const sales = require("./salesRouter");

router.use("/products", products);
router.use("/clients", clients);
router.use("/sales", sales);

module.exports = router;
