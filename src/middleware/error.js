/* const ErrorHandler = require("../utils/errorHandler");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  // Error de ID incorrecto en MySQL
  if (err instanceof TypeError && err.code === "ERR_ASSERTION") {
    const message = `Resource not found. Invalid: ${err.message.split(" ")[1]}`;
    err = new ErrorHandler(message, 400);
  }

  // Error de clave duplicada en MySQL
  if (err.code === "ER_DUP_ENTRY") {
    const message = `Duplicate entry for key ${err.index}`;
    err = new ErrorHandler(message, 400);
  }

  // Otros errores específicos de MySQL
  if (err.code) {
    const message = `MySQL Error: ${err.message}`;
    err = new ErrorHandler(message, 500);
  }

  // Error JWT incorrecto
  if (err.name === "JsonWebTokenError") {
    const message = `Json Web Token is invalid, Try again `;
    err = new ErrorHandler(message, 400);
  }

  // JWT EXPIRE error
  if (err.name === "TokenExpiredError") {
    const message = `Json Web Token is Expired, Try again `;
    err = new ErrorHandler(message, 400);
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};
 */