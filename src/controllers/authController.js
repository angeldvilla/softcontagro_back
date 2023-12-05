const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Users = require("../models/usersModel");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const cloudinary = require("cloudinary");

// Registrar un usuario
const registerUser = catchAsyncErrors(async (req, res, next) => {
  const {
    nombre,
    apellido,
    cedula,
    telefono,
    email,
    contraseña,
  } = req.body;

  // Subir avatar a Cloudinary (si está presente)
  let avatarUrl = "";
  if (req.file) {
    const result = await cloudinary.v2.uploader.upload(req.file.path, {
      folder: "avatars",
      width: 150,
      crop: "scale",
    });

    avatarUrl = result.secure_url;
  } else {
    avatarUrl = "https://res.cloudinary.com/dxe4igvmq/image/upload/v1701735128/avatars/vq3vfsnac9izn50yvgpw.png";
  }

  const user = await Users.create({
    nombre,
    apellido,
    cedula,
    telefono,
    email,
    contraseña,
    avatar_url: avatarUrl,
  });

  sendToken(user, 201, res);
});


// Iniciar sesión
const loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, contraseña } = req.body;


  // Verificar si el usuario ha proporcionado contraseña y correo electrónico
  if (!email || !contraseña) {
    return next(new ErrorHandler("Por favor ingrese correo & contraseña", 400));
  }

  // Buscar el usuario por su correo electrónico
  const user = await Users.findOne({
    where: { email: email },
    attributes: { include: ["contraseña"] },
  });

  // Verificar si el usuario existe
  if (!user) {
    return next(
      new ErrorHandler("Correo electrónico o contraseña no válidos", 401)
    );
  }

  const isPasswordMatched = await user.comparePassword(contraseña);

  if (!isPasswordMatched) {
    return next(
      new ErrorHandler("Correo electrónico o contraseña no válidos", 401)
    );
  }

  sendToken(user, 200, res);
});

// Cerrar sesión
const logout = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Sesión cerrada",
  });
});

// Recuperar contraseña
const forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const { email } = req.body;
  const user = await Users.findOne({ where: { email } });

  if (!user) {
    return next(new ErrorHandler("Usuario no encontrado", 404));
  }

  // Obtener el token de restablecimiento de contraseña
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/password/reset/${resetToken}`;

  const message = `Su token de restablecimiento de contraseña es :- \n\n ${resetPasswordUrl} \n\nSi no ha solicitado este correo electrónico, ignórelo.`;
  try {
    await sendEmail({
      email: user.email,
      subject: `SoftContAgro Finca La Lolita - Recuperación de contraseña`,
      message,
    });

    res.status(200).json({
      success: true,
      message: `Correo de recuperación de contraseña enviado a ${user.email} correctamente`,
    });
  } catch (error) {
    // En caso de error, limpiar el token y la expiración
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    // Guardar el usuario sin validación
    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler(error.message, 500));
  }
});

// Restablecer contraseña
const resetPassword = catchAsyncErrors(async (req, res, next) => {
  // crear hash para el token
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  // Buscar usuario con el token y que no haya caducado
  const user = await Users.findOne({
    where: {
      reset_password_token: resetPasswordToken,
      reset_password_expire: { [Op.gt]: Date.now() },
    },
  });

  // Verificar si el usuario existe
  if (!user) {
    return next(
      new ErrorHandler(
        "El token de restablecimiento de contraseña no es válido o ha caducado",
        400
      )
    );
  }

  // Verificar que las contraseñas coincidan
  if (req.body.contraseña !== req.body.confirmPassword) {
    return next(new ErrorHandler("Las contraseñas no coinciden", 400));
  }

  // Establecer la nueva contraseña y limpiar el token y la expiración
  user.contraseña = req.body.contraseña;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  // Guardar el usuario actualizado
  await user.save();

  // Enviar el nuevo token al cliente
  sendToken(user, 200, res);
});

// Obtener detalles del usuario
const getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  try {
    // Buscar usuario por ID
    const user = await Users.findByPk(id);

    // Verificar si el usuario existe
    if (!user) {
      return next(new ErrorHandler(`El usuario no existe con Id: ${id}`, 404));
    }

    // Enviar los detalles del usuario en la respuesta
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return next(new ErrorHandler(`Error al obtener detalles del usuario: ${error.message}`, 500));
  }
});

// actualizar contraseña
const updatePassword = catchAsyncErrors(async (req, res, next) => {
  const userId = req.params.id;

  try {
    // Buscar usuario por ID
    const user = await Users.findByPk(userId, { attributes: { include: ["contraseña"] } });

    // Verificar si el usuario existe
    if (!user) {
      return next(new ErrorHandler(`El usuario no existe con Id: ${userId}`, 404));
    }

    // Verificar la antigua contraseña
    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);
    if (!isPasswordMatched) {
      return next(new ErrorHandler("Antigua contraseña es incorrecta", 400));
    }

    // Verificar si las nuevas contraseñas coinciden
    if (req.body.newPassword !== req.body.confirmPassword) {
      return next(new ErrorHandler("Las contraseñas no coinciden", 400));
    }

    // Actualizar la contraseña
    user.contraseña = req.body.newPassword;
    await user.save();

    // Enviar nuevo token
    sendToken(user, 200, res);
  } catch (error) {
    // Manejar errores de base de datos u otros errores inesperados
    return next(new ErrorHandler(`Error al actualizar la contraseña: ${error.message}`, 500));
  }
});

// actualizar perfil de usuario
const updateProfile = catchAsyncErrors(async (req, res, next) => {
  const userId = req.params.id;
  const { nombre, apellido, cedula, telefono, email, avatar_url } = req.body;

  try {
    // Buscar usuario por ID
    const user = await Users.findByPk(userId);

    // Verificar si el usuario existe
    if (!user) {
      return next(new ErrorHandler(`Usuario no encontrado con ID: ${userId}`, 404));
    }

    const updatedUserData = {
      nombre,
      apellido,
      cedula,
      telefono,
      email,
      avatar_url: avatar_url || user.avatar_url,
    };

    // Si se proporciona una nueva URL de avatar, destruir la imagen antigua y cargar la nueva
    if (avatar_url) {
      const imageId = user.avatar_url;
      await cloudinary.v2.uploader.destroy(imageId);

      const myCloud = await cloudinary.v2.uploader.upload(avatar_url, {
        folder: "avatars",
        width: 150,
        crop: "scale",
      });

      updatedUserData.avatar_url = myCloud.secure_url;
    }

    // Actualizar los datos del usuario
    await Users.update(updatedUserData, {
      where: { id: userId },
    });

    res.status(200).json({
      success: true,
      message: "Datos actualizados correctamente",
    });
  } catch (error) {
    return next(new ErrorHandler(`Error al actualizar el perfil: ${error.message}`, 500));
  }
});

// Obtener datos de todos los usuarios(admin)
const getAllUsers = catchAsyncErrors(async (req, res, next) => {
  const users = await Users.findAll();

  res.status(200).json({
    success: true,
    users,
  });
});

// Obtener datos de un usuario (admin)
const getSingleUser = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  try {
    const user = await Users.findByPk(id);

    if (!user) {
      return next(
        new ErrorHandler(`El usuario no existe con Id: ${id}`)
      );
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return next(new ErrorHandler(`Error al obtener datos del usuario: ${error.message}`, 500));
  }
});

// actualizar rol de un usuario -- Admin
const updateUserRole = catchAsyncErrors(async (req, res, next) => {
  const userId = req.params.id;
  const { rol_id } = req.body;

  try {
    // Verificar si el usuario existe
    const user = await Users.findByPk(userId);
    if (!user) {
      return next(new ErrorHandler(`El usuario no existe con Id: ${userId}`, 404));
    }

    // Actualizar el rol del usuario
    await Users.update({ rol_id }, { where: { id: userId } })

    res.status(200).json({
      success: true,
      message: "Rol de usuario actualizado correctamente",
    });
  } catch (error) {
    return next(new ErrorHandler(`Error al actualizar el rol del usuario: ${error.message}`, 500));
  }
});

// Eliminar usuario --Admin
const deleteUser = catchAsyncErrors(async (req, res, next) => {
  const userId = req.params.id;

  try {
    const user = await Users.findByPk(userId);

    if (!user) {
      return next(
        new ErrorHandler(`El usuario no existe con Id: ${userId}`, 400)
      );
    }

    const imageId = user.avatar_url;

    await cloudinary.v2.uploader.destroy(imageId);

    // Eliminar el usuario
    await Users.destroy({ where: { id: userId } });

    res.status(200).json({
      success: true,
      message: "Usuario eliminado correctamente",
    });
  }
  catch (error) {
    // Manejar errores de base de datos u otros errores inesperados
    return next(new ErrorHandler(`Error al eliminar el usuario: ${error.message}`, 500));
  }
});


module.exports = {
  registerUser,
  loginUser,
  logout,
  forgotPassword,
  updatePassword,
  resetPassword,
  updateProfile,
  getAllUsers,
  getUserDetails,
  getSingleUser,
  updateUserRole,
  deleteUser,
}