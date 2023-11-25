const db = require("../db.js");

const getAuthentication = async (username, password) => {
  const [credentials] = await db.execute(
    `
      SELECT
        u.id AS ID,
        u.usuario_nombre AS Nombre,
        u.usuario_apellido AS Apellido,
        u.usuario_telefono AS Telefono,
        u.usuario_genero AS Genero, 
        u.usuario_cargo AS Cargo,
        u.usuario_email AS Correo,
        u.usuario_usuario AS Usuario,
        u.usuario_clave AS Contrasena,
        u.usuario_cuenta_estado AS Estado,
        u.usuario_foto AS Foto
        FROM usuario u WHERE u.usuario_usuario = ? AND u.usuario_clave = ?
      `,
    [username, password]
  );
  return credentials;
};

module.exports = { getAuthentication };
