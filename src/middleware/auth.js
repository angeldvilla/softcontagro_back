const ErrorHander = require("../utils/errorHandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");
const Users = require("../models/usersModel");

const isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(
      new ErrorHander(
        "Por favor inicie sesión para acceder a este recurso",
        401
      )
    );
  }

  const decodedData = jwt.verify(token, process.env.JWT_SECRET);

  req.user = await Users.findByPk(decodedData.id);

  next();
});

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.rol_id)) {
      return next(
        new ErrorHander(
          `El rol de: ${req.user.rol_id} no tiene permiso para acceder a este recurso. `,
          403
        )
      );
    }

    next();
  };
};

module.exports = { isAuthenticatedUser, authorizeRoles };