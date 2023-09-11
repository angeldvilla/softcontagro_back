const { Router } = require("express");
const router = Router();

const products = require ('./productsRouter');

router.use("/productos", products);


module.exports = router;