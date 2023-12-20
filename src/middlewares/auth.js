const User = require('../models/user')

const jwt = require("jsonwebtoken");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("./catchAsyncErrors");

// Comprueba si el usuario está autenticado o no
exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {

    const token = req.cookies.token

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Inicie sesión primero para acceder a este recurso.'
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Token inválido. Inicie sesión primero para acceder a este recurso.'
        });
    }
})

// Manejo de roles de usuarios
exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'Acceso no autorizado para este recurso'
            })

        }
        next()
    }
}