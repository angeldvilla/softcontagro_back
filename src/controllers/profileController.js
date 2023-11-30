const db = require("../db.js");

const getProfileUser = async (userId) => {
  try {
    const [profile] = await db.execute(
      `
      SELECT nombre_completo AS NombreCompleto, cedula AS Cedula, telefono AS Telefono, correo_electronico AS Correo, imagen_url AS Imagen FROM usuarios WHERE id = ? 
        `,
      [userId]
    );

    return profile[0];
  } catch (error) {
    console.error("Error en la consulta de perfil:", error);
  }
};

const updateProfileUser = async (userId, profile) => {
  try {
    await db.execute(
      `
      UPDATE usuarios SET nombre_completo = ?, cedula = ?, telefono = ?, correo_electronico = ?, imagen_url = ? WHERE id = ? 
        `,
      [
        profile.NombreCompleto,
        profile.Cedula,
        profile.Telefono,
        profile.Correo,
        profile.Imagen,
        userId,
      ]
    );
  } catch (error) {
    console.error("Error en la actualización de perfil:", error);
  }
};

// Realizar borrado lógico del perfil del usuario
const deleteProfileUser = async (userId) => {
  try {
    await db.execute(
      `
      UPDATE usuarios 
      SET estado = 0
      WHERE id = ?
      `,
      [userId]
    );
  } catch (error) {
    console.error("Error en el borrado lógico de perfil:", error);
  }
};

module.exports = { getProfileUser, updateProfileUser, deleteProfileUser };
