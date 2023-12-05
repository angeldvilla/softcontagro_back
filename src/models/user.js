const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const crypto = require('crypto')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Por favor, escriba su nombre'],
        maxLength: [30, 'Su nombre no puede exceder los 30 caracteres']
    },
    email: {
        type: String,
        required: [true, 'Por favor escriba su correo'],
        unique: true,
        validate: [validator.isEmail, 'Por favor ingrese una dirección de correo electrónico válida']
    },
    password: {
        type: String,
        required: [true, 'Por favor, introduzca su contraseña'],
        minlength: [6, 'Ynuestra contraseña debe tener más de 6 caracteres'],
        select: false
    },
    avatar: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    role: {
        type: String,
        default: 'user'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date

})

// Cifrar la contraseña antes de guardar el usuario
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next()
    }

    this.password = await bcrypt.hash(this.password, 10)
})

// Comparar contraseña de usuario
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

// Devolver token JWT
userSchema.methods.getJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_TIME
    });
}

// Generar token de restablecimiento de contraseña
userSchema.methods.getResetPasswordToken = function () {
    // Generar token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash y configurado para restablecerPasswordToken
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex')

    // Establecer el tiempo de caducidad del token
    this.resetPasswordExpire = Date.now() + 30 * 60 * 1000

    return resetToken

}

module.exports = mongoose.model('User', userSchema);