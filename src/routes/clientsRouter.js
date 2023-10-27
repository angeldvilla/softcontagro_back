const { Router } = require("express");
const { allClientesHandler } = require("../handlers/clientsHandler");

const clientsRouter = Router();

clientsRouter.get("/allClients", allClientesHandler);

module.exports = clientsRouter;
