const mysql = require("mysql2/promise");
require("dotenv").config();

// data base config
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "softcontagro2",
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = db;
