const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Users = require("../models/usersModel");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const cloudinary = require("cloudinary");

// Registrar un usuario
const registerUser = catchAsyncErrors(async (req, res, next) => {

  const { avatar_public_id, avatar_secure_url, nombre, apellido, cedula, telefono, email, contraseña } = req.body;

  const myCloud = await cloudinary.v2.uploader.upload(avatar_public_id, avatar_secure_url, {
    folder: "avatars",
    width: 150,
    crop: "scale",
  });

  const user = await Users.create({
    nombre,
    apellido,
    cedula,
    telefono,
    email,
    contraseña,
    avatar_public_id: myCloud.public_id,
    avatar_secure_url: myCloud.secure_url,
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
  const user = await Users.findOne({ where: { email: email } });

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
      message: `Correo enviado a ${user.email} correctamente`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

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

  const user = await Users.findOne({
    where: {
      reset_password_token: resetPasswordToken,
      reset_password_expire: { [Op.gt]: Date.now() },
    },
  });


  if (!user) {
    return next(
      new ErrorHandler(
        "El token de restablecimiento de contraseña no es válido o ha caducado",
        400
      )
    );
  }

  if (req.body.contraseña !== req.body.confirmPassword) {
    return next(new ErrorHandler("Las contraseñas no coinciden", 400));
  }

  user.contraseña = req.body.contraseña;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendToken(user, 200, res);
});

// Obtener detalles del usuario
const getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  const user = await Users.findByPk(id);

  if (!user) {
    return next(new ErrorHandler(`El usuario no existe con Id: ${id}`, 404));
  }

  res.status(200).json({
    success: true,
    user,
  });
});

// actualizar contraseña
const updatePassword = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  const user = await Users.findOne({
    where: { id },
    attributes: { include: ["contraseña"] },
  });

  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Antigua contraseña es incorrecta", 400));
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHandler("Las contraseñas no coinciden", 400));
  }

  user.contraseña = req.body.newPassword;

  await user.save();

  sendToken(user, 200, res);
});

// actualizar perfil de usuario
const updateProfile = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  const { avatar_public_id, avatar_secure_url, nombre, apellido, cedula, telefono, email } = req.body;

  const updatedUserData = {
    nombre: nombre,
    apellido: apellido,
    cedula: cedula,
    telefono: telefono,
    username: username,
    email: email,
  };

  if (avatar_public_id && avatar_secure_url !== "") {
    const user = await Users.findByPk(id);

    if (!user) {
      return next(new ErrorHandler(`Usuario no encontrado con ID: ${id}`, 404));
    }

    const imageId = user.avatar_public_id;

    await cloudinary.v2.uploader.destroy(imageId);

    const myCloud = await cloudinary.v2.uploader.upload(avatar_public_id, avatar_secure_url, {
      folder: "avatars",
      width: 150,
      crop: "scale",
    });

    updatedUserData.avatar_public_id = myCloud.public_id;
    updatedUserData.avatar_secure_url = myCloud.secure_url;
  }

  // Actualizar los datos del usuario
  await Users.update(updatedUserData, {
    where: { id: id },
  });

  res.status(200).json({
    success: true,
    message: "Datos actualizados correctamente",
  });
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
});

// actualizar rol de un usuario -- Admin
const updateUserRole = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  const { role_id } = req.body;

  // Verificar si el usuario existe
  const user = await Users.findByPk(id);
  if (!user) {
    return next(new ErrorHandler(`El usuario no existe con Id: ${id}`, 404));
  }

  // Actualizar el rol del usuario
  await Users.update({ role_id }, { where: { id: id } })

  res.status(200).json({
    success: true,
    message: "Rol de usuario actualizado correctamente",
  });
});

// Eliminar usuario --Admin
const deleteUser = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  const user = await Users.findByPk(id);

  if (!user) {
    return next(
      new ErrorHandler(`El usuario no existe con Id: ${id}`, 400)
    );
  }

  const imageId = user.avatar_public_id;

  await cloudinary.v2.uploader.destroy(imageId);

  // Eliminar el usuario
  await Users.destroy({ where: { id: id } });

  res.status(200).json({
    success: true,
    message: "Usuario eliminado correctamente",
  });
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