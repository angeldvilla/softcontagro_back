require('dotenv').config();
const { COOKIE_EXPIRES_TIME } = process.env;


// Crea y envía token y guarda en la cookie.
const sendToken = (user, statusCode, res) => {

    // Crear JWT Token
    const token = user.getJwtToken();

    // Opciones para cookies
    const options = {
        expires: new Date(
            Date.now() + COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000
        ),
        httpOnly: true
    }

    res.cookie('token', token, options)

    res.status(statusCode).json({
        success: true,
        token,
        user
    })

}

module.exports = sendToken;