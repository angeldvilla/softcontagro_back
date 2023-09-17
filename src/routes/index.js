const { Router } = require("express");
const router = Router();

const products = require ('./productsRouter');

router.use("/products", products);
router.use("/clients", products);
router.use("/sales", products);


module.exports = router;