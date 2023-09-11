const { Router } = require ('express');
/* const { allProductsHandler } = require ('../handlers/productsHandler'); */

const productsRoute = Router();

productsRoute.get("/allProducts" , "allProductsHandler");


module.exports = productsRoute;