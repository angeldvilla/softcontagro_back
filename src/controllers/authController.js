const db = require("../db.js");

const getAuthentication = async (username, password) => {
  try {
    const [credentials] = await db.execute(
      `
        SELECT
          u.id AS ID,
          u.nombre_completo AS NombreCompleto,
          u.cedula AS Cedula,
          u.telefono AS Telefono,
          u.nombre_usuario AS Usuario, 
          u.correo_electronico AS CorreoElectronico,
          u.contraseña AS Contraseña,
          u.imagen_url AS Imagen,
          u.estado AS Estado,
          r.nombre AS Rol
        FROM usuarios u 
        INNER JOIN usuarios_roles ur ON u.id = ur.usuario_id
        INNER JOIN roles r ON ur.rol_id = r.id
        WHERE u.nombre_usuario = ? AND u.contraseña = ?
      `,
      [username, password]
    );
    return {
      code: 200,
      message: "Inicio de sesión exitoso",
      data: credentials,
    };
  } catch (error) {
    console.error("Error en la consulta de autenticación:", error);
  }
};

module.exports = { getAuthentication };
