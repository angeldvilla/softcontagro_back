const { Router } = require("express");
const salesRoutes = Router();
const {
  getSales,
  createSale,
  editSale,
  deleteSale,
} = require("../handlers/salesHandler");

salesRoutes.get("/", getSales);

salesRoutes.post("/newSale", createSale);

salesRoutes.put("/:id", editSale);

salesRoutes.delete("/:id", deleteSale);

module.exports = salesRoutes;
