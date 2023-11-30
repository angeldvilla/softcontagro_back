const { Router } = require("express");
const categoryRoutes = Router();
const { getCategorys, editCategory } = require("../handlers/categoryHandler");

categoryRoutes.get("/", getCategorys);

categoryRoutes.put("/edit", editCategory);

module.exports = categoryRoutes;
