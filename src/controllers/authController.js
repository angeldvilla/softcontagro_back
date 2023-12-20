const User = require('../models/user');

const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const sendToken = require('../utils/jwtToken');
const sendEmail = require('../utils/sendEmail');

const crypto = require('crypto');
const cloudinary = require('cloudinary');

// Registrar un usuario   => /api/v1/register
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
    try {
        const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
            folder: 'avatars',
            width: 150,
            crop: "scale"
        });

        const { name, email, password } = req.body;

        const user = await User.create({
            name,
            email,
            password,
            avatar: {
                public_id: result.public_id,
                url: result.secure_url
            }
        });

        res.status(201).json({
            success: true,
            message: 'Registro exitoso',
            user
        });
    } catch (error) {
        console.error("Error en el controlador de registro:", error);
        res.status(500).json({
            success: false,
            message: 'Error al registrar el usuario',
        });
    }
});


// Inicio de sesion  =>  /api/v1/login
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select('+password');

        console.log("Usuario encontrado:", user);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Correo electrónico o contraseña no válidos',
            });
        }

        const isPasswordMatched = await user.comparePassword(password);

        console.log("Contraseña coincidente:", isPasswordMatched);

        if (!isPasswordMatched) {
            return res.status(401).json({
                success: false,
                message: 'Correo electrónico o contraseña no válidos',
            });
        }
        sendToken(user, 200, res);
    } catch (error) {
        console.error("Error en el controlador de login:", error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
        });
    }
});



// Recuperar Contraseña   =>  /api/v1/password/forgot
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {

    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'Usuario no encontrado con este correo electrónico',
        })
    }

    // Generar y obtener token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    // Crear el url de reseteo de contraseña
    const resetUrl = `${req.protocol}://${req.get('host')}/password/reset/${resetToken}`;

    const message = `Su token de restablecimiento de contraseña es:\n\n${resetUrl}\n\nSi no ha solicitado este correo electrónico, ignórelo.`

    try {

        await sendEmail({
            email: user.email,
            subject: 'SoftContAgro Finca La Lolita - Recuperación de contraseña',
            message
        })

        res.status(200).json({
            success: true,
            message: `Correo de recuperación de contraseña enviado a: ${user.email}`
        })

    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });

        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
        })
    }

})

// Restablecer contraseña   =>  /api/v1/password/reset/:token
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {

    // crear hash para el token
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex')

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    })

    if (!user) {
        return res.status(400).json({
            success: false,
            message: 'El token de restablecimiento de contraseña no es válido o ha caducado',
        })
    }

    if (req.body.password !== req.body.confirmPassword) {
        return res.status(400).json({
            success: false,
            message: 'Las contraseñas no coinciden',
        })
    }

    // Configurar nueva contraseña
    user.password = req.body.password;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendToken(user, 200, res)

})


// Obtener los detalles del usuario actualmente registrado   =>   /api/v1/me
exports.getUserProfile = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        user
    })
})


// Actualizar contraseña   =>  /api/v1/password/update
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id).select('+password');

    //Verifica la contraseña del usuario anterior
    const isMatched = await user.comparePassword(req.body.oldPassword)
    if (!isMatched) {
        return res.status(500).json({
            success: false,
            message: 'Contraseña incorrecta',
        })
    }

    user.password = req.body.password;
    await user.save();

    sendToken(user, 200, res)

})


// Actualizar perfil de usuario   =>   /api/v1/me/update
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email
    }

    // Update avatar
    if (req.body.avatar !== '') {
        const user = await User.findById(req.user.id)

        const image_id = user.avatar.public_id;
        const res = await cloudinary.v2.uploader.destroy(image_id);

        const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
            folder: 'avatars',
            width: 150,
            crop: "scale"
        })

        newUserData.avatar = {
            public_id: result.public_id,
            url: result.secure_url
        }
    }

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true
    })
})


// Cerrar Sesión   =>   /api/v1/logout
exports.logout = catchAsyncErrors(async (req, res, next) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })

    res.status(200).json({
        success: true,
        message: 'Sesión cerrada'
    })
})

// Rutas de Administrador

// Obtener datos de todos los usuarios(   =>   /api/v1/admin/users
exports.allUsers = catchAsyncErrors(async (req, res, next) => {
    const users = await User.find();

    res.status(200).json({
        success: true,
        users
    })
})


// Obtener datos de un usuario   =>   /api/v1/admin/user/:id
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return res.status(400).json({
            success: false,
            message: `Usuario no encontrado con el ID: ${req.params.id}`,
        })
    }

    res.status(200).json({
        success: true,
        user
    })
})

// Actualizar perfil de usuario   =>   /api/v1/admin/user/:id
exports.updateUser = catchAsyncErrors(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    }

    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true,
        message: "Usuario actualizado"
    })
})

// Eliminar usuario   =>   /api/v1/admin/user/:id
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return res.status(400).json({
            success: false,
            message: `Usuario no encontrado con el ID: ${req.params.id}`,
        })
    }

    // Eliminar avatar de Cloudinary
    const image_id = user.avatar.public_id;
    await cloudinary.v2.uploader.destroy(image_id);

    await user.remove();

    res.status(200).json({
        success: true,
        message: 'Usuario eliminado'
    })
})