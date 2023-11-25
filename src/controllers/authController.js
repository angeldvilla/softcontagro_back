const db = require("../db.js");

const getAuthentication = async (username, password) => {
  try {
    const [credentials] = await db.execute(
      `
            SELECT
              u.id AS ID,
              u.nombre_completo AS Nombre Completo,
              u.cedula AS Cedula,
              u.telefono AS Telefono,
              u.nombre_usuario AS Usuario, 
              u.correo_electronico AS Correo Electronico,
              u.contraseña AS Contraseña,
              u.imagen_url AS Imagen,
              u.estado AS Estado,
              FROM usuario u 
              INNER JOIN roles
              r.nombre AS Rol
              FROM usuarios u
              INNER JOIN usuarios_roles ur ON u.id = ur.usuario_id
              INNER JOIN roles r ON ur.rol_id = r.id
              WHERE u.nombre_usuario = ? AND u.contraseña = ?
            `,
      [username, password]
    );
    return credentials;
  } catch (error) {
    console.log("Error en la consulta de autenticación:", error);
    throw error;
  }
};

module.exports = { getAuthentication };
