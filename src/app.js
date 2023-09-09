const express = require('express');
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoose = require('mongoose');
const { DB_URL } = process.env
/* const routes = require("./routes/index") */
const server = express();
const port = process.env.PORT || 3002;

// middleware, rutas
server.name = "API";
server.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
server.use(bodyParser.json({ limit: "50mb" }));
server.use(cookieParser());
server.use(morgan("dev"));

server.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});

server.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || err;
  console.error(err);
  res.status(status).send(message);
});

// Conexión a MongoDB 
mongoose
  .connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    // Inicia el servidor
    server.listen(port, () => {
      console.log(`Server listen on port ${port}`);
    });
    console.log("Connected to MongoDB Atlas")
  })
  .catch((error) => console.log(console.error(error)));

module.exports = server;