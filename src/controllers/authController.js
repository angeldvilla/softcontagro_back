const ErrorHander = require("../utils/errorHandler");
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

  // checking if user has given contraseña and email both

  if (!email || !contraseña) {
    return next(new ErrorHander("Por favor ingrese correo & contraseña", 400));
  }

  const user = await Users.findOne({ email }).select("+contraseña");

  if (!user) {
    return next(
      new ErrorHander("Correo electrónico o contraseña no válidos", 401)
    );
  }

  const isPasswordMatched = await user.comparePassword(contraseña);

  if (!isPasswordMatched) {
    return next(
      new ErrorHander("Correo electrónico o contraseña no válidos", 401)
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
  const user = await Users.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHander("Usuario no encontrado", 404));
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

    return next(new ErrorHander(error.message, 500));
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
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHander(
        "El token de restablecimiento de contraseña no es válido o ha caducado",
        400
      )
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHander("La contraseña no es contraseña", 400));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendToken(user, 200, res);
});

// Obtener detalles del usuario
const getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = await Users.findByPk(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
});

// actualizar contraseña
const updatePassword = catchAsyncErrors(async (req, res, next) => {
  const user = await Users.findByPk(req.user.id).select("+contraseña");

  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

  if (!isPasswordMatched) {
    return next(new ErrorHander("Antigua contraseña es incorrecta", 400));
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHander("Las contraseñas no coinciden", 400));
  }

  user.password = req.body.newPassword;

  await user.save();

  sendToken(user, 200, res);
});

// actualizar perfil de usuario
const updateProfile = catchAsyncErrors(async (req, res, next) => {
  const { avatar_public_id, avatar_secure_url, nombre, apellido, cedula, telefono, email } = req.body;
  const newUserData = {
    nombre: nombre,
    apellido: apellido,
    cedula: cedula,
    telefono: telefono,
    username: username,
    email: email,
  };

  if (avatar_public_id && avatar_secure_url !== "") {
    const user = await Users.findByPk(req.user.id);

    const imageId = user.avatar_public_id;

    await cloudinary.v2.uploader.destroy(imageId);

    const myCloud = await cloudinary.v2.uploader.upload(avatar_public_id, avatar_secure_url, {
      folder: "avatars",
      width: 150,
      crop: "scale",
    });

    newUserData.avatar_public_id = myCloud.public_id;
    newUserData.avatar_secure_url = myCloud.secure_url;
  }

  const user = await Users.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    message: "Datos actualizados correctamente",
  });
});

// Obtener datos de todos los usuarios(admin)
const getAllUser = catchAsyncErrors(async (req, res, next) => {
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
      new ErrorHander(`El usuario no existe con Id: ${id}`)
    );
  }

  res.status(200).json({
    success: true,
    user,
  });
});

// actualizar rol de un usuario -- Admin
const updateUserRole = catchAsyncErrors(async (req, res, next) => {
  const id = req.params;
  const { avatar_public_id, avatar_secure_url, nombre, apellido, cedula, telefono, email, role_id } = req.body;

  const newUserData = {
    nombre: nombre,
    apellido: apellido,
    cedula: cedula,
    telefono: telefono,
    email: email,
    role_id: role_id,
  };

  await Users.findByIdAndUpdate(id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    message: "Rol de usuario actualizado correctamente",
  });
});

// Eliminar usuario --Admin
const deleteUser = catchAsyncErrors(async (req, res, next) => {
  const id = req.params;
  const user = await Users.findById(id);

  if (!user) {
    return next(
      new ErrorHander(`El usuario no existe con Id: ${id}`, 400)
    );
  }

  const imageId = user.avatar_public_id;

  await cloudinary.v2.uploader.destroy(imageId);

  await user.remove();

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
  resetPassword,
  getUserDetails,
  updatePassword,
  updateProfile,
  getAllUser,
  getSingleUser,
  updateUserRole,
  deleteUser,
}