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
    return { code: 500, message: "Error en el servidor" };
  }
};

const updateProfileUser = async (userId, profile) => {
  try {
    const [profile] = await db.execute(
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
    return {
      code: 200,
      message: "Perfil actualizado exitosamente",
      data: profile,
    };
  } catch (error) {
    console.error("Error en la actualización de perfil:", error);
    return { code: 500, message: "Error en el servidor" };
  }
};

// Realizar borrado lógico del perfil del usuario
const deleteProfileUser = async (userId) => {
  try {
    const [account] = await db.execute(
      `
      UPDATE usuarios 
      SET estado = 0
      WHERE id = ?
      `,
      [userId]
    );
    return {
      code: 200,
      message: "Cuenta eliminada exitosamente",
      data: account,
    };
  } catch (error) {
    console.error("Error en el borrado lógico de perfil:", error);
    return { code: 500, message: "Error en el servidor" };
  }
};

module.exports = { getProfileUser, updateProfileUser, deleteProfileUser };
