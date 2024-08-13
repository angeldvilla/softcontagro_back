const ErrorHandler = require('../utils/errorHandler');


module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;

    if (process.env.NODE_ENV === 'DEVELOPMENT') {
        console.log(err);

        res.status(err.statusCode).json({
            success: false,
            error: err,
            errMessage: err.message,
            stack: err.stack
        })
    }

    if (process.env.NODE_ENV === 'PRODUCTION') {
        let error = { ...err }

        error.message = err.message;

        // Error de ID de objeto de Mongoose incorrecto
        if (err.name === 'CastError') {
            const message = `Resource not found. Invalid: ${err.path}`
            error = new ErrorHandler(message, 400)
        }

        // Errores de validación de Mongoose
        if (err.name === 'ValidationError') {
            const message = Object.values(err.errors).map(value => value.message);
            error = new ErrorHandler(message, 400)
        }

        // Errores de claves duplicadas en Mongoose
        if (err.code === 11000) {
            const message = `Clave duplicada ${Object.keys(err.keyValue)} ingresada`
            error = new ErrorHandler(message, 400)
        }

        // Manejo incorrecto de errores JWT
        if (err.name === 'JsonWebTokenError') {
            const message = 'El token ha expirado. ¡Intente de nuevo!'
            error = new ErrorHandler(message, 400)
        }

        // Cómo manejar el error JWT caducado
        if (err.name === 'TokenExpiredError') {
            const message = 'El token ha expirado. ¡Intente de nuevo!'
            error = new ErrorHandler(message, 400)
        }

        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || 'Lo sentimos hubo un error interno del servidor'
        })
    }

}