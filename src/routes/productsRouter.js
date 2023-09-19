const { Router } = require ('express');
const { allProductsHandler } = require ('../handlers/productsHandler');

const productsRouter = Router();

productsRouter.get("/allProducts" , allProductsHandler);


module.exports = productsRouter;