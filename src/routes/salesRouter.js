const { Router } = require ('express');
const { allSalesHandler } = require ('../handlers/salesHandler');

const salesRouter = Router();

salesRouter.get("/allSales" , allSalesHandler);


module.exports = salesRouter;