const {
  getProfileUser,
  updateProfileUser,
  deleteProfileUser,
} = require("../controllers/profileController");

const profileUser = async (req, res) => {
  try {
    const userId = req.user.userId;
    const profile = await getProfileUser(userId);

    return res.status(200).json({
      code: 200,
      message: "Perfil obtenido exitosamente",
      data: profile,
    });
  } catch (error) {
    console.error("Error en el servidor, intente más tarde", error);
    return res.status(500).json({ code: 500, message: "Error en el servidor" });
  }
};

// Editar perfil del usuario
const editProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const {
      nombre_completo,
      cedula,
      telefono,
      correo_electronico,
      imagen_url,
    } = req.body;

    // Lógica para actualizar el perfil en la base de datos
    await updateProfileUser(userId, {
      nombre_completo,
      cedula,
      telefono,
      correo_electronico,
      imagen_url,
    });

    return res.status(200).json({
      code: 200,
      message: "Perfil actualizado exitosamente",
    });
  } catch (error) {
    console.error("Error en el servidor, intente mas tarde", error);
    return res.status(500).json({ code: 500, message: "Error en el servidor" });
  }
};

// Eliminar cuenta del usuario
const deleteProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Lógica para realizar borrado lógico
    await deleteProfileUser(userId);

    return res.status(200).json({
      code: 200,
      message: "Cuenta eliminada exitosamente",
    });
  } catch (error) {
    console.error("Error en el servidor, intente mas tarde", error);
    return res.status(500).json({ code: 500, message: "Error en el servidor" });
  }
};

module.exports = { profileUser, editProfile, deleteProfile };
