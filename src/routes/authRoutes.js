const { Router } = require("express");
const bcrypt = require("bcrypt");
const db = require("../db");
const authRoutes = Router();
const { authUser } = require("../handlers/autHandler");
const { verifyTokenMiddleware, clearToken } = require("../utils/authUtils");
// Registro de usuario
authRoutes.post("/register", async (req, res) => {
  try {
    const {
      nombre_completo,
      cedula,
      telefono,
      correo_electronico,
      nombre_usuario,
      contraseña,
    } = req.body;
    const hashedPassword = await bcrypt.hash(contraseña, 10);

    // Insertar usuario en la base de datos
    const [result] = await db.execute(
      "INSERT INTO usuarios (nombre_completo, cedula, telefono, nombre_usuario, correo_electronico, contraseña, imagen_url, estado) VALUES (?, ?, ?, ?, ?, ?, 'https://cdn-icons-png.flaticon.com/512/6596/6596121.png', 1)",
      [
        nombre_completo,
        cedula,
        telefono,
        nombre_usuario,
        correo_electronico,
        hashedPassword,
      ]
    );

    // Obtener el ID del usuario insertado
    const userId = result.insertId;

    // Insertar la relación entre usuario y rol en la tabla usuarios_roles
    await db.execute(
      ` 
      INSERT INTO usuarios_roles (usuario_id, rol_id) VALUES (?, 2)
      `,
      [userId]
    );

    return res
      .status(201)
      .json({ code: 200, message: "Usuario registrado exitosamente" });
  } catch (error) {
    console.error("Error en el registro:", error);
    return res.status(500).json({ error: "Error en el servidor" });
  }
});

// inicio de sesión
authRoutes.post("/login", async (req, res) => {
  try {
    const { nombre_usuario, contraseña } = req.body;

    const result = await authUser(nombre_usuario, contraseña);

    if (result.code === 200) {
      return res.status(result.code).json({
        code: result.code,
        message: result.message,
        data: result.data,
        token: result.token,
      });
    } else {
      return res.status(result.code).json({
        code: result.code,
        message: result.message,
      });
    }
  } catch (error) {
    return res.status(500).json({
      code: 500,
      message: "Error en el servidor",
    });
  }
});

authRoutes.post("/logout", verifyTokenMiddleware, (req, res) => {
  clearToken(res);
  return res.status(200).json({
    code: 200,
    message: "Sesión cerrada exitosamente",
  });
});

/* authRoutes.get("/protected", verifyTokenMiddleware, (req, res) => {
  // Si llega hasta aquí, el token es válido
  res.status(200).json({ message: "Ruta protegida", user: req.user });
}); */

module.exports = authRoutes;
